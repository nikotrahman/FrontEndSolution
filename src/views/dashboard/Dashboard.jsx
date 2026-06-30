import React from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import WidgetsBrand from '../widgets/WidgetsBrand'
import WidgetsDropdown from '../widgets/WidgetsDropdown'
import MainChart from './MainChart'
import BmkgPanel from './BmkgPanel'
import StockViewPage from './StockViewPage'

function Dashboard() {
  return (
    <>
      {/* First row: BMKG, Stock, Panel 3 */}
      <CRow>
        <CCol xs={12} md={6} lg={4}>
          <CCard>
            <CCardHeader>BMKG Weather & Earthquakes</CCardHeader>
            <CCardBody>
              <BmkgPanel />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} lg={4}>
          <CCard>
            <CCardHeader>Stock Market Dashboard</CCardHeader>
            <CCardBody>
              <StockViewPage />
            </CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} lg={4}>
          <CCard>
            <CCardHeader>Panel 3</CCardHeader>
            <CCardBody>{/* Content for Panel 3 */}</CCardBody>
          </CCard>
        </CCol>
      </CRow>

      {/* Second row: Panel 4, Panel 5, Panel 6 */}
      <CRow className="mt-4">
        <CCol xs={12} md={6} lg={4}>
          <CCard>
            <CCardHeader>Panel 4</CCardHeader>
            <CCardBody>{/* Content for Panel 4 */}</CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} lg={4}>
          <CCard>
            <CCardHeader>Panel 5</CCardHeader>
            <CCardBody>{/* Content for Panel 5 */}</CCardBody>
          </CCard>
        </CCol>

        <CCol xs={12} md={6} lg={4}>
          <CCard>
            <CCardHeader>Panel 6</CCardHeader>
            <CCardBody>{/* Content for Panel 6 */}</CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
