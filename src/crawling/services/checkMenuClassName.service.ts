export const checkMenuClassName = (className: string): boolean => {
  switch (className) {
    case 'photo_type':
      return true;
    case 'nophoto_type':
      return true;
    case 'nophoto_type menu_fst':
      return true;
    case '':
      return true;
    case ' type_name':
      return true;
    default:
      return false;
  }
};
