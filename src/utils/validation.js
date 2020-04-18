import { extend } from "vee-validate";
import { required, email } from "vee-validate/dist/rules";

extend("email", { ...email, message: "Please enter a valid email address" });
extend("required", { ...required, message: "This field is required" });
