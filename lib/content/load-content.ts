import { cache } from "react";
import { rawContent } from "./raw-content";
import { validateContent } from "./validate-content";

export const loadContent = cache(() => {
  const catalog = validateContent();

  return {
    ...catalog,
    institutionCollections: rawContent.institutionCollections.records,
    admissions: rawContent.admissions.records,
    medical: rawContent.medical,
    journey: rawContent.journey,
    preparation: rawContent.preparation,
    ucMajorCatalog: catalog.ucMajorCatalog,
  };
});
