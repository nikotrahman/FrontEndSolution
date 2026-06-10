import React from 'react';
import { 
  CModal, 
  CModalHeader, 
  CModalTitle, 
  CModalBody, 
  CModalFooter 
} from '@coreui/react';

const ReusableModal2 = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  footerContent 
}) => {
  return (
    <CModal visible={isOpen} onClose={onClose}>
      <CModalHeader onClose={onClose}>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        {children}
      </CModalBody>
      <CModalFooter>
        {footerContent}
      </CModalFooter>
    </CModal>
  );
};

export default ReusableModal2;