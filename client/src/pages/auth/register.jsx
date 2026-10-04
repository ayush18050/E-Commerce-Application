import CommonForm from "@/components/common/form";
import { registerFormControls } from "@/config";
import { useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch } from "react-redux";
import { registerUser } from "@/store/auth-slice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const initialState = {
  name: '',
  email: '',
  password: ''
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const {toast } = useToaster();
  function onSubmit(event) {
    event.preventDefault();
    dispatch(registerUser(formData)).then((data)=>{ 
      console.log("data", data);
      if (data?.payload?.success){
         toast.success("User registered successfully");
         navigate('/auth/login') } else {
          console.log(data);
         toast.error(data?.payload?.message || "Some error occurred while registering the user", {variant: 'destructive'});
          }});
    
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create new account</h1>
        <p className="mt-2">Already have an account?
          <Link to="/auth/login" className="font-medium ml-2 text-primary hover:underline">Login</Link>
        </p>
      </div>
      <CommonForm
      formControls={registerFormControls}
      buttonText={"Sign Up"}
      formData={formData}
      setFormData={setFormData}
      onSubmit={onSubmit}
      />
    </div>
  )
}

export default AuthRegister