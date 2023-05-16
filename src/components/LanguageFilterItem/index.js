// Write your code here
import './index.css'

const LanguageFilterItem = props => {
  const {tabDetails, setActiveTabId, isActive} = props
  const {id, language} = tabDetails
  const tabClassName = isActive ? 'active-tab' : 'non-active-tab'

  const updateId = () => {
    setActiveTabId(id)
  }
  return (
    <li className="tab-list-items">
      <button className={tabClassName} type="button" onClick={updateId}>
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
