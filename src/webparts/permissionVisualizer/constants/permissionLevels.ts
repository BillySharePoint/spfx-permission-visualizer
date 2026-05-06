/**
 * Common SharePoint permission level names
 */
export const PERMISSION_LEVELS = {
    FULL_CONTROL: "Full Control",
    DESIGN: "Design",
    EDIT: "Edit",
    CONTRIBUTE: "Contribute",
    READ: "Read",
    LIMITED_ACCESS: "Limited Access",
    VIEW_ONLY: "View Only"
};

/**
 * SharePoint list base templates
 */
export const LIST_TEMPLATES = {
    DOCUMENT_LIBRARY: 101,
    CUSTOM_LIST: 100,
    SITE_PAGES: 119,
    PAGES_LIBRARY: 850,
    FORM_LIBRARY: 115,
    PICTURE_LIBRARY: 109,
    ASSET_LIBRARY: 851
};

/**
 * FSObjType values for items/folders
 */
export const FS_OBJ_TYPE = {
    FILE: 0,
    FOLDER: 1
};

/**
 * Default scanning limits
 */
export const SCAN_DEFAULTS = {
    MAX_ITEMS_PER_LIST: 2000,
    BATCH_SIZE: 100,
    MAX_LISTS_PER_SITE: 500
};
