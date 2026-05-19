import UserService from "@repo/services/user";
import FormService from "@repo/services/form";

export const userService = new UserService();

export const formService = new FormService();

import FormFieldService from "@repo/services/form-field";
export const formFieldService = new FormFieldService();