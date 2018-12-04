import { debug } from "@common/helpers";

export function setDefaultFormValue(formName, form) {
  return {
    type: "COMMON_FORMS_SET_DEFAULT",
    form: form,
    formName: formName
  };
}

export function setFormValue(field, value) {
  return {
    field: field,
    value: value,
    type:
      "COMMON_FORMS_SET_VALUE_" +
      field.form.name
        .replace(/([A-Z]+)/g, "_$1")
        .toUpperCase()
        .replace(".", "_")
  };
}

export function addUploadFile(file) {
  return {
    file: file,
    type: "COMMON_FORMS_ADD_FILE"
  };
}

export function submit() {
  return {
    type: "COMMON_FORMS_SUBMIT"
  };
}

export function cancel() {
  return {
    type: "COMMON_FORMS_CANCEL"
  };
}

export function reducer(state, action) {
  if (action.type == "Navigation/NAVIGATE") return state;

  switch (action.type) {
    case "COMMON_FORMS_SUBMIT":
      return {
        ...state
      };

    case "UPLOADS_SUCCESS":
      if (!state.form[action.form].uploads)
        state.form[action.form].uploads = [];

      state.form[action.form].uploads.push({
        token: action.return.upload.token,
        filename: action.file.filename,
        content_type: action.file.type
      });

      return {
        ...state
      };

    case "COMMON_FORMS_ADD_FILE":
      state.uploads.push(action.file);
      return {
        ...state
      };

    case "COMMON_FORMS_SET_DEFAULT":
      state.form[action.formName] = action.form;
      return {
        ...state
      };

    default:
      debug.trace("forms.reducer", action, state);
      if (action.hasOwnProperty("contentIsLoading")) {
        state.contentIsLoading = action.contentIsLoading;
        return { ...state };
      }

      if (action.type.substr(0, 22) === "COMMON_FORMS_SET_VALUE") {
        if (typeof state.form[action.field.form.name] === "undefined")
          state.form[action.field.form.name] = {};

        state.form[action.field.form.name][action.field.name] = action.value;
        return { ...state };
      } else {
        return state;
      }
  }
}
