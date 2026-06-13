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
    <CModal
      visible={isOpen}
      onClose={onClose}
      size="lg" 
      scrollable 
    >
      <CModalHeader onClose={onClose}>
        <CModalTitle>{title}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="table-responsive">
          {/* ✅ wrap children so tables shrink/scroll on small screens */}
          {children}
        </div>
      </CModalBody>
      <CModalFooter>{footerContent}</CModalFooter>
    </CModal>
  )
};

export default ReusableModal2;