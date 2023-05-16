import './index.css'
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    activeLanguage: languageFiltersData[0].id,
    repositaryList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getRepositary()
  }

  getRepositary = async () => {
    const {activeLanguage} = this.state
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const apiUrl = `https://apis.ccbp.in/popular-repos?language=${activeLanguage}`
    const response = await fetch(apiUrl)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.popular_repos.map(repos => ({
        name: repos.name,
        id: repos.id,
        issuesCount: repos.issues_count,
        forksCount: repos.forks_count,
        starsCount: repos.stars_count,
        imageUrl: repos.avatar_Url,
      }))

      this.setState({
        repositaryList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  setActiveTabId = id => {
    this.setState(
      {
        activeLanguage: id,
      },
      this.getRepositary,
    )
  }

  renderRepositoryList = () => {
    const {repositaryList} = this.state
    return (
      <ul className="tab-items-container">
        {repositaryList.map(tabItem => (
          <RepositoryItem key={tabItem.id} tabItems={tabItem} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure"
        className="failure-img"
      />
      <h1 className="failure-heading">Something Went Wrong</h1>
    </div>
  )

  renderLoadingView = () => (
    <div className="loader-view">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderApiView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoryList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderTabs = () => {
    const {activeLanguage} = this.state
    return (
      <ul className="tabs-list">
        {languageFiltersData.map(eachItem => (
          <LanguageFilterItem
            key={eachItem.id}
            tabDetails={eachItem}
            setActiveTabId={this.setActiveTabId()}
            isActive={activeLanguage === eachItem.id}
          />
        ))}
      </ul>
    )
  }

  render() {
    return (
      <div className="app-container">
        <h1 className="heading">popular</h1>
        {this.renderTabs()}
        {this.renderApiView()}
      </div>
    )
  }
}

export default GithubPopularRepos
