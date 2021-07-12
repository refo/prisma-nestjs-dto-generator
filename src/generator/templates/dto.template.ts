import { DMMF as PrismaDMMF } from "@prisma/client/runtime";
import { mapScalarToTSType } from "../helpers";
import { GenerateCodeOptions } from "../options";

interface CreateDtoTemplateOptions {
  model: PrismaDMMF.Model;
  classSuffix: string;
  classPrefix: string;
  caseFn: (input: string) => string;
  options: GenerateCodeOptions,
}

export function createDtoTemplate({
  model,
  classSuffix,
  classPrefix,
  caseFn,
  options,
}: CreateDtoTemplateOptions) {
  let template = "";

  const shouldImportPrisma = model.fields
    .filter((field) => field.kind === "scalar")
    .some((field) => mapScalarToTSType(field.type, false).includes("Prisma"));

  if (shouldImportPrisma) {
    template += "import { Prisma } from '@prisma/client';\n";
  }

  const dtos = model.fields
    .map((field) => (field.kind === "object" && field.type !== model.name ? field.type : ""))
    .filter(Boolean);

  const enums = model.fields
    .map((field) => (field.kind === "enum" ? field.type : ""))
    .filter(Boolean);

  if (!options.excludeRelations) {
    for (const importField of new Set(dtos)) {
      template += `import { ${classPrefix}${importField}${classSuffix} } from './${caseFn(
        importField
      )}.dto';`;
    }
  }

  for (const enumField of new Set(enums)) {
    template += `import { ${classPrefix}${enumField} } from './${caseFn(
      enumField
    )}.enum';`;
  }

  template += "\n\n";

  template += `export class ${classPrefix}${model.name}${classSuffix} {`;

  for (const field of model.fields) {
    if (field.kind === 'object' && options.excludeRelations) continue;

    template += `${field.name}${field.isRequired && !field.isList ? "" : "?"}: ${field.kind === "scalar"
      ? mapScalarToTSType(field.type, false)
      : field.kind === "enum"
        ? `${classPrefix}${field.type}`
        : `${classPrefix}${field.type}${classSuffix}`
      }${field.isList ? "[]" : ""};`;
  }

  template += "}";

  return template;
}
