import { Button } from "@/components/ui/button";
import { Fragment, useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import CommonForm from "@/components/common/form";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts , addNewProduct, editProduct, deleteProduct } from "@/store/admin/products-slice";
import { data } from "react-router-dom";
import { Toaster, toast } from 'sonner'
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData = {
  image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
};

function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState(null);
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const {productList} = useSelector((state) => state.adminProducts);

  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null ? dispatch(editProduct({
      id: currentEditedId, formData
    })).then((data)=>{
      if(data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenCreateProductDialog(false);
        setFormData(initialFormData);
        setCurrentEditedId(null);
      }
    }) :
    dispatch(addNewProduct({
      ...formData,
      image: uploadedImageUrl
    })).then((data)=>{
      if(data?.payload?.success) {
        dispatch(fetchAllProducts());
        setOpenCreateProductDialog(false);
        setFormData(initialFormData);
        setCurrentEditedId(null);
      }
    });
  }

  function handleDelete(getCurrentProductId) {
      dispatch(deleteProduct(getCurrentProductId)).then((data)=>{
        if(data?.payload?.success) {
          dispatch(fetchAllProducts());
        }
      });

  }

  function isFormValid() {
    return Object.keys(formData).
    map((key)=>formData[key] !== "").
    every((val)=>val);
  }

  useEffect(()=>{
    dispatch(fetchAllProducts());
  },[dispatch])

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductDialog(true)}>
          Add New Product
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((product) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductDialog={setOpenCreateProductDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={product}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet
        open={openCreateProductDialog}
        onOpenChange={() => {
          setOpenCreateProductDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
            </SheetTitle>
          </SheetHeader>
          <div className="px-6">
            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              imageLoadingState={imageLoadingState}
              isEditMode={currentEditedId !== null}
            />
          </div>
          <div className="p-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
