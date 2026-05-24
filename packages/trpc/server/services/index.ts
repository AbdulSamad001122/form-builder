import UserService from "@repo/services/user";
import FormService from "@repo/services/form";

export const userService = new UserService();

export const formService = new FormService();

import FormFieldService from "@repo/services/form-field";
export const formFieldService = new FormFieldService();

import FormResponseService from "@repo/services/form-response";
export const formResponseService = new FormResponseService();

import CustomBrandService from "@repo/services/custom-brand";
export const customBrandService = new CustomBrandService();