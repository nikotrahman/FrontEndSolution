import React, {useState,useEffect} from 'react';
import * as apiServices from '../../../services/apiServices';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle,
  CTableFoot,
  CForm, CFormInput, CFormLabel, CFormFloating, CFormSelect, CFormTextarea,
} from '@coreui/react'
import { DocsComponents, DocsExample } from 'src/components'
import ReusableModal from '../../modal/ReusableModal';   
import { CIcon } from '@coreui/icons-react';
import { cilList, cilPencil, cilTrash, cilPeople,cilPlus } from '@coreui/icons';
import { Date } from 'core-js/web';

const Tables = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalType, setModalType] = useState(null); // 'delete' or 'update' or 'view'
  const [isLoading, setIsLoading] = useState(false);

  //  GET All Data Function
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiServices.getUsers();
        setData(response);
      }finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // For Insert Modal
  const [visible, setVisible] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    placeOfBirth: '',
    dateOfBirth: ''
  })

  const handleInputChange = (e) => {   
     const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value
    }));
  };  

  // INSERT Function
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await apiServices.createUser(formData);
      alert('Data inserted successfully!');
      // Reset form and close modal on success
      setFormData({ name: '', placeOfBirth: '', dateOfBirth: '' });
      setVisible(false);
      //fetchData(); // Refresh data after successful creation
      const updatedData = await apiServices.getUsers();
      setData(updatedData); 
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create user. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };  

  // VIEW Function
const fetchSelectedUser = async (id) => {
  try {
    const response = await apiServices.getUserById(id);
    setSelectedUser(response);
  } catch (error) {
    console.error('Error fetching user details:', error);
  } finally {
    setLoading(false);
  }
};
// UPDATE Function
  const handleUpdate = async () => {
    try {
      const response = await apiServices.updateUser(selectedUser.id, selectedUser);
      setUsers(users.map(u => u.id === selectedUser.id ? response : u));
      const updatedData = await apiServices.getUsers();
      setData(updatedData); 
      closeModal();
    } catch (error) {
      console.error("Error updating user", error);
    }
  };

// DELETE Function
  const handleDelete = async () => {
    try {
      await apiServices.deleteUser(selectedUser.id);
      setUsers(users.filter(u => u.id !== selectedUser.id));
      const updatedData = await apiServices.getUsers();
      setData(updatedData); 
      closeModal();
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  const closeModal = () => {
    setModalType(null);
    setSelectedUser(null);
  };

  // Render loading state or the main content
  if (loading) {
    return <div>Loading...</div>;
  }
  return (
  
    <CRow>
      <CModal visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader>
          <CModalTitle>User Registration</CModalTitle>
        </CModalHeader>
        <CForm onSubmit={handleSubmit}>
          <CModalBody>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="name"
                label="Name"
                placeholder="Enter name"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="text"
                name="placeOfBirth"
                label="Place of Birth"
                placeholder="Enter place of birth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <CFormInput
                type="date"
                name="dateOfBirth"
                label="Date of Birth"
                value={formData.dateOfBirth}
                onChange={handleInputChange}
                required
              />
            </div>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" type="button" onClick={() => setVisible(false)}>
              Cancel
            </CButton>
            <CButton color="primary" type="submit">
              Submit Details
            </CButton>
          </CModalFooter>
        </CForm>
      </CModal>

      <CCol xs={12}>
        <CCard className="mb-4">
      <ReusableModal
        isOpen={modalType !== null}
        onClose={closeModal}
        title={
          modalType === 'delete' ? 'Delete Confirmation' : 
          modalType === 'view' ? 'User Details' : 'Edit User'
        }
        footerContent={
          modalType === 'delete' ? (
            <>
              <CButton color="secondary" onClick={closeModal}>Cancel</CButton>
              <CButton color="danger" onClick={handleDelete}>Delete</CButton>
            </>
          ) : (
            <>
              <CButton color="secondary" onClick={closeModal}>Cancel</CButton>
              <CButton color="primary" onClick={handleUpdate}>Save Changes</CButton>
            </>
          )
        }
      >
        {modalType === 'delete' ? (
          <p>Are you sure you want to delete {selectedUser?.name}?</p>
        ) : (
          selectedUser && (
            <form>
              <div className="mb-3">
                <label>Name</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={selectedUser.name} 
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                  disabled={modalType === 'view'}
                /> 
              </div>
              <div className="mb-3">
                <label>Place of Birth</label>
                <input 
                  type="text" 
                  className="form-control" 
                  value={selectedUser.placeOfBirth} 
                  onChange={(e) => setSelectedUser({ ...selectedUser, placeOfBirth: e.target.value })} 
                  disabled={modalType === 'view'} 
                />
              </div>
              <div className="mb-3">  
                <label>Date of Birth</label>
                <input 
                  type="date" 
                  className="form-control" 
                  value={selectedUser.dateOfBirth ? selectedUser.dateOfBirth.split('T')[0] : ''} 
                  onChange={(e) => setSelectedUser({ ...selectedUser, dateOfBirth: e.target.value })} 
                  disabled={modalType === 'view'} 
                />
              </div>
            </form>
          ) 
        )}
      </ReusableModal>

          <CCardHeader align="center">
            <CIcon icon={cilPeople} className="me-2" size="sm" />
            Data Users
            <CButton style={{ float: 'right' }} color="success " size="sm" className="ms-2" onClick={() => setVisible(true)}>
                <CIcon icon={cilPlus} className="me-2" size="sm" />
                  Add User
            </CButton>
          </CCardHeader>
          <CCardBody>
            <CTable hover>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell scope="col">No</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Name</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Place Of Birth</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Date Of Birth</CTableHeaderCell>
                  <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {data.map((item,index) => (
                  <CTableRow key={item.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{item.name}</CTableDataCell>
                    <CTableDataCell>{item.placeOfBirth}</CTableDataCell>
                    <CTableDataCell>{new Date(item.dateOfBirth).toLocaleDateString()}</CTableDataCell>
                    <CTableDataCell>
                      <CButton color="primary" size="sm" onClick={() => { fetchSelectedUser(item.id); setModalType('view'); }}>
                        <CIcon icon={cilList} className="me-2" size="sm" />
                          Detail
                      </CButton>
                      <CButton color="warning" size="sm" className="ms-2" onClick={() => { fetchSelectedUser(item.id); setModalType('update'); }}>
                        <CIcon icon={cilPencil} className="me-2" size="sm" />
                        Edit
                      </CButton>
                      <CButton color="danger" size="sm" className="ms-2" onClick={() => { fetchSelectedUser(item.id); setModalType('delete'); }}>
                        <CIcon icon={cilTrash} className="me-2" size="sm" />
                        Delete
                      </CButton>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>  
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}
export default Tables
