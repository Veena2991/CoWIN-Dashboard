import {Component} from 'react'

import Loader from 'react-loader-spinner'

import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  in_progress: 'IN_PROGRESS',
}

class CowinDashboard extends Component {
  state = {
    apiStatus: apiStatusConstants.initial,
    vaccinationData: {},
  }

  componentDidMount() {
    this.getDashboardDetails()
  }

  getDashboardDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.in_progress})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'

    const response = await fetch(url)

    if (response.ok === true) {
      const fetchedData = await response.json()

      const updatedData = {
        last7DaysVaccination: fetchedData.last_7_days_vaccination.map(
          eachD => ({
            vaccineDate: eachD.vaccine_date,
            dose1: eachD.dose_1,
            dose2: eachD.dose_2,
          }),
        ),
        vaccinationByAge: fetchedData.vaccination_by_age.map(eachA => ({
          age: eachA.age,
          count: eachA.count,
        })),
        vaccinationByGender: fetchedData.vaccination_by_gender.map(eachG => ({
          count: eachG.count,
          gender: eachG.gender,
        })),
      }
      this.setState({
        vaccinationData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderSuccessView = () => {
    const {vaccinationData} = this.state

    return (
      <>
        <VaccinationCoverage
          vaccinationCoverageDetails={vaccinationData.last7DaysVaccination}
        />

        <VaccinationByGender
          vaccinationByGenderDetails={vaccinationData.vaccinationByGender}
        />

        <VaccinationByAge
          vaccinationByAgeDetails={vaccinationData.vaccinationByAge}
        />
      </>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-heading">Something went wrong</h1>
    </div>
  )

  renderDashboard = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.in_progress:
        return this.renderLoadingView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <div className="cowin-dashboard-container">
          <div className="logo-heading-container">
            <img
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
              className="logo-img"
            />
            <h1 className="heading">Co-WIN</h1>
          </div>
          <h1 className="sub-heading">CoWIN Vaccination in India</h1>
          {this.renderDashboard()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
