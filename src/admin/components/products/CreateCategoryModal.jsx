import React from "react";
import CategoryDrawerForm from "../categories/CategoryDrawerForm";
import AdminModal from "../shared/AdminModal";

const CreateCategoryModal = ({ open, saving, onClose, onCreate }) => {
  const handleClose = () => {
    if (saving) return;
    onClose();
  };

  const handleSubmit = async (formData) => {
    const created = await onCreate(formData);
    onClose(created);
  };

  return (
    <AdminModal
      open={open}
      onClose={handleClose}
      title="Add Category"
      description="Create a new category without leaving the product form."
    >
      <CategoryDrawerForm
        saving={saving}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </AdminModal>
  );
};

export default CreateCategoryModal;
