import { getCategoryIcon } from '../components/Constants/Categories';

/**
 * Attaches a lucide icon *component* (item.Icon) based on category_id.
 * Call sites render it with <item.Icon className="..." />.
 */
export const AddCategoryIcon = (data) => {
  const processData = (item) => {
    item.Icon = getCategoryIcon(item.category_id);
    return item;
  };

  if (Array.isArray(data)) {
    return data.map((item) => processData(item));
  } else if (data && typeof data === 'object') {
    return processData(data);
  }
  return null;
};
