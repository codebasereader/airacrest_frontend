import React from "react";
import SubcategoryDrawerForm from "../subcategories/SubcategoryDrawerForm";
import AdminModal from "../shared/AdminModal";

const CreateSubcategoryModal = ({
  open,
  categories,
  defaultCategoryId = "",
  saving,
  onClose,
  onCreate,
}) => {
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
      title="Add Subcategory"
      description="Create a new subcategory under an existing category."
    >
      <SubcategoryDrawerForm
        categories={categories}
        defaultCategoryId={defaultCategoryId}
        saving={saving}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </AdminModal>
  );
};

export default CreateSubcategoryModal;
