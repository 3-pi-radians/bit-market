import React from "react";
import { useField, ErrorMessage, Field} from "formik";

import { inputFieldTypes, fieldComponents } from "../../utils/input-types";
import "./InputField.css"

const InputField = (props) => {
    const {label, icon, field_type, field_component, ...rest} = props;
    const [fields, meta] = useField(rest);

    const getRequiredComponent = () => {
        switch(field_component) {
            case fieldComponents.INPUT: {
                return <input 
                    className={`inputfield--boxed-input ${rest.disabled ? "inputfieled--boxed-disabled" : ""}`} 
                    {...fields} {...rest} autoComplete="off" />
            };

            case fieldComponents.SELECT: {
                return <Field as={"select"} 
                className={`inputfield--boxed-input ${rest.disabled ? "inputfiled--boxed-disabled" : ""}`} 
                {...fields} {...rest}>
                {
                    rest.options.map(option => {
                        return (
                            <option key={option.value} value={option.value}>
                                {option.key}
                            </option>
                        )
                    })
                }
            </Field>
            }
        }
    };

    if (field_type === inputFieldTypes.OPEN) {
        return (
            <div className="inputfield--open">
                <label htmlFor={fields.name}>{icon} {label}</label>
                <input 
                    className={`inputfield--boxed-input ${rest.disabled ? "inputfieled--boxed-disabled" : ""}`} 
                    {...fields} {...rest} autoComplete="off" />
                <div className="inputfield--open-errormessage" >
                    <ErrorMessage name={fields.name} />
                </div>
            </div>
        )
    } else if (inputFieldTypes.BOXED) {
        return (
            <div className="inputfield--boxed"> 
                <div className="inputfield--boxed-inputcontainer">
                    <label className="inputfield--boxed-label" htmlFor={fields.name}>{label}</label>
                    <div className={`inputfield--boxed-field ${rest.disabled ? "inputfield--boxed-disabled" : ""}`}>
                    {icon}
                    {getRequiredComponent()}
                    </div>
                </div>
                <div className="inputfield--boxed-errormessage" >
                    <ErrorMessage name={fields.name} />
                </div>
            </div>
        )
    }
};

export default InputField;