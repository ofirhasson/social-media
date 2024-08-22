class GenericFormData<T> {
  public createFormData(model: T): FormData {
    const formData = new FormData();

    Object.entries(model).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item: any) => {
          formData.append(`${key}`, item._id);
        });
      } else if (
        typeof value === "object" &&
        value !== null &&
        "_id" in value
      ) {
        formData.append(key, value._id);
      } else {
        formData.append(key, value);
      }
    });
    return formData;
  }
}

export const genericFormData = new GenericFormData();
