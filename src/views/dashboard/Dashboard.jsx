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

function Dashboard() {
  return (
    <CRow>
      <CCol xs={12} md={6} lg={4}>
        {/* Panel 6 */}
        <BmkgPanel />
      </CCol>
      <CCol xs={12} md={6} lg={4}>
        {/* Panel 2 */}
        <CCard>
          <CCardHeader>Panel 2</CCardHeader>
        </CCard>
      </CCol>

      <CCol xs={12} md={6} lg={4}>
        {/* Panel 3 */}
        <CCard>
          <CCardHeader>Panel 3</CCardHeader>
        </CCard>
      </CCol>

      <CCol xs={12} md={6} lg={4}>
        {/* Panel 4 */}
        <CCard>
          <CCardHeader>Panel 4</CCardHeader>
        </CCard>
      </CCol>

      <CCol xs={12} md={6} lg={4}>
        {/* Panel 5 */}
        <CCard>
          <CCardHeader>Panel 5</CCardHeader>
        </CCard>
      </CCol>

      <CCol xs={12} md={6} lg={4}>
        {/* Panel 6 */}
        <CCard>
          <CCardHeader>Panel 6</CCardHeader>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Dashboard
