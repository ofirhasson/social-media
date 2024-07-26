

class GenericFormData<T> {


    // public createFormData(model: T): FormData {
    //     const formData = new FormData();
    
    //     const appendFormData = (key: string, value: any) => {
    //       if (typeof value === 'object' && value !== null) {
    //         if (Array.isArray(value)) {
    //           value.forEach((item) => appendFormData(key, item));
    //         } else {
    //           Object.entries(value).forEach(([subKey, subValue]) => {
    //             appendFormData(`${key}.${subKey}`, subValue);
    //           });
    //         }
    //       } else {
    //         formData.append(key, value);
    //       }
    //     };
    
    //     Object.entries(model).forEach(([key, value]) => appendFormData(key, value));
    
    //     return formData;
    //   }
     

  public createFormData(model: T): FormData {
    const formData = new FormData();
    Object.entries(model).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        value.forEach((item: any) => {
          formData.append(`${key}`, item._id);
        });

      } else if(typeof value === "object" && value !== null && '_id' in value) {
        formData.append(key, value._id)
      } 
      else {
        formData.append(key, value);
      }
    });
    return formData;
  }


}

export const genericFormData = new GenericFormData()
