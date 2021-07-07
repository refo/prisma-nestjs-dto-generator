import { DMMF as PrismaDMMF } from "@prisma/client/runtime";

interface CreateEnumTemplateOptions {
  enumModel: PrismaDMMF.DatamodelEnum;
  classPrefix: string;
}

export function createEnumTemplate(options: CreateEnumTemplateOptions) {

  return createObjectAndType(options);
}

function createObjectAndType({
  enumModel,
  classPrefix,
}: CreateEnumTemplateOptions) {

  const objectName = `${classPrefix}${enumModel.name}`;

  const enumValues = enumModel.values.map(value => {
    const dbName = value.dbName ?? value.name;
    return `${value.name} : '${dbName}',`;
  });


  return `
export const ${objectName} = {
  ${enumValues.join('\n')}
}

export type ${objectName} = typeof ${objectName}[keyof typeof ${objectName}];

`;

}

function createEnum({
  enumModel,
  classPrefix,
}: CreateEnumTemplateOptions) {

  let template = "";

  template += `export enum ${classPrefix}${enumModel.name} {\n`;

  for (const enumValue of enumModel.values) {
    template += `${enumValue.name}${enumValue.dbName ? `= '${enumValue.dbName}'` : ""
      },\n`;
  }
  template += "}";

  return template;

}
