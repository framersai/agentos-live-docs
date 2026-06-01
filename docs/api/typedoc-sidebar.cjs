// @ts-check
/** @type {import("@docusaurus/plugin-content-docs").SidebarsConfig} */
const typedocSidebar = {
  items: [
    {
      type: "category",
      label: "Core",
      items: [
        {
          type: "doc",
          id: "api/classes/AgentOS",
          label: "AgentOS"
        },
        {
          type: "doc",
          id: "api/interfaces/Agent",
          label: "Agent"
        },
        {
          type: "doc",
          id: "api/functions/agency",
          label: "agency"
        },
        {
          type: "doc",
          id: "api/functions/agent",
          label: "agent"
        }
      ]
    },
    {
      type: "category",
      label: "Other",
      items: [
        {
          type: "category",
          label: "z",
          items: [
            {
              type: "category",
              label: "Namespaces",
              items: [
                {
                  type: "category",
                  label: "coerce",
                  items: [
                    {
                      type: "category",
                      label: "Functions",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/coerce/functions/bigint",
                          label: "bigint"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/coerce/functions/boolean",
                          label: "boolean"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/coerce/functions/date",
                          label: "date"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/coerce/functions/number",
                          label: "number"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/coerce/functions/string",
                          label: "string"
                        }
                      ]
                    }
                  ],
                  link: {
                    type: "doc",
                    id: "api/@framers/namespaces/z/namespaces/coerce/index"
                  }
                },
                {
                  type: "category",
                  label: "core",
                  items: [
                    {
                      type: "category",
                      label: "Namespaces",
                      items: [
                        {
                          type: "category",
                          label: "JSONSchema",
                          items: [
                            {
                              type: "category",
                              label: "Interfaces",
                              items: [
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/interfaces/ArraySchema",
                                  label: "ArraySchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/interfaces/BooleanSchema",
                                  label: "BooleanSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/interfaces/IntegerSchema",
                                  label: "IntegerSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/interfaces/NullSchema",
                                  label: "NullSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/interfaces/NumberSchema",
                                  label: "NumberSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/interfaces/ObjectSchema",
                                  label: "ObjectSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/interfaces/StringSchema",
                                  label: "StringSchema"
                                }
                              ]
                            },
                            {
                              type: "category",
                              label: "Type Aliases",
                              items: [
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/type-aliases/JSONSchema",
                                  label: "_JSONSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/type-aliases/BaseSchema",
                                  label: "BaseSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/type-aliases/JSONSchema-1",
                                  label: "JSONSchema"
                                },
                                {
                                  type: "doc",
                                  id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/type-aliases/Schema",
                                  label: "Schema"
                                }
                              ]
                            }
                          ],
                          link: {
                            type: "doc",
                            id: "api/@framers/namespaces/z/namespaces/core/namespaces/JSONSchema/index"
                          }
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Classes",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/classes/$ZodAsyncError",
                          label: "$ZodAsyncError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/classes/$ZodEncodeError",
                          label: "$ZodEncodeError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/classes/$ZodRegistry",
                          label: "$ZodRegistry"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/classes/Doc",
                          label: "Doc"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/classes/JSONSchemaGenerator",
                          label: "JSONSchemaGenerator",
                          className: "typedoc-sidebar-item-deprecated"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Interfaces",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodType",
                          label: "_$ZodType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeInternals",
                          label: "_$ZodTypeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$constructor",
                          label: "$constructor"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$RefinementCtx",
                          label: "$RefinementCtx"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodAny",
                          label: "$ZodAny"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodAnyDef",
                          label: "$ZodAnyDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodAnyInternals",
                          label: "$ZodAnyInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodArray",
                          label: "$ZodArray"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodArrayDef",
                          label: "$ZodArrayDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodArrayInternals",
                          label: "$ZodArrayInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBase64",
                          label: "$ZodBase64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBase64Def",
                          label: "$ZodBase64Def"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBase64Internals",
                          label: "$ZodBase64Internals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBase64URL",
                          label: "$ZodBase64URL"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBase64URLDef",
                          label: "$ZodBase64URLDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBase64URLInternals",
                          label: "$ZodBase64URLInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBigInt",
                          label: "$ZodBigInt"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBigIntDef",
                          label: "$ZodBigIntDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBigIntFormat",
                          label: "$ZodBigIntFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBigIntFormatDef",
                          label: "$ZodBigIntFormatDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBigIntFormatInternals",
                          label: "$ZodBigIntFormatInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBigIntInternals",
                          label: "$ZodBigIntInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBoolean",
                          label: "$ZodBoolean"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBooleanDef",
                          label: "$ZodBooleanDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodBooleanInternals",
                          label: "$ZodBooleanInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCatch",
                          label: "$ZodCatch"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCatchCtx",
                          label: "$ZodCatchCtx"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCatchDef",
                          label: "$ZodCatchDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCatchInternals",
                          label: "$ZodCatchInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheck",
                          label: "$ZodCheck"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckBigIntFormat",
                          label: "$ZodCheckBigIntFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckBigIntFormatDef",
                          label: "$ZodCheckBigIntFormatDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckBigIntFormatInternals",
                          label: "$ZodCheckBigIntFormatInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckDef",
                          label: "$ZodCheckDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckEndsWith",
                          label: "$ZodCheckEndsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckEndsWithDef",
                          label: "$ZodCheckEndsWithDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckEndsWithInternals",
                          label: "$ZodCheckEndsWithInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckGreaterThan",
                          label: "$ZodCheckGreaterThan"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckGreaterThanDef",
                          label: "$ZodCheckGreaterThanDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckGreaterThanInternals",
                          label: "$ZodCheckGreaterThanInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckIncludes",
                          label: "$ZodCheckIncludes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckIncludesDef",
                          label: "$ZodCheckIncludesDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckIncludesInternals",
                          label: "$ZodCheckIncludesInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckInternals",
                          label: "$ZodCheckInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLengthEquals",
                          label: "$ZodCheckLengthEquals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLengthEqualsDef",
                          label: "$ZodCheckLengthEqualsDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLengthEqualsInternals",
                          label: "$ZodCheckLengthEqualsInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLessThan",
                          label: "$ZodCheckLessThan"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLessThanDef",
                          label: "$ZodCheckLessThanDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLessThanInternals",
                          label: "$ZodCheckLessThanInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLowerCase",
                          label: "$ZodCheckLowerCase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLowerCaseDef",
                          label: "$ZodCheckLowerCaseDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckLowerCaseInternals",
                          label: "$ZodCheckLowerCaseInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMaxLength",
                          label: "$ZodCheckMaxLength"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMaxLengthDef",
                          label: "$ZodCheckMaxLengthDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMaxLengthInternals",
                          label: "$ZodCheckMaxLengthInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMaxSize",
                          label: "$ZodCheckMaxSize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMaxSizeDef",
                          label: "$ZodCheckMaxSizeDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMaxSizeInternals",
                          label: "$ZodCheckMaxSizeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMimeType",
                          label: "$ZodCheckMimeType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMimeTypeDef",
                          label: "$ZodCheckMimeTypeDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMimeTypeInternals",
                          label: "$ZodCheckMimeTypeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMinLength",
                          label: "$ZodCheckMinLength"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMinLengthDef",
                          label: "$ZodCheckMinLengthDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMinLengthInternals",
                          label: "$ZodCheckMinLengthInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMinSize",
                          label: "$ZodCheckMinSize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMinSizeDef",
                          label: "$ZodCheckMinSizeDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMinSizeInternals",
                          label: "$ZodCheckMinSizeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMultipleOf",
                          label: "$ZodCheckMultipleOf"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMultipleOfDef",
                          label: "$ZodCheckMultipleOfDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckMultipleOfInternals",
                          label: "$ZodCheckMultipleOfInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckNumberFormat",
                          label: "$ZodCheckNumberFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckNumberFormatDef",
                          label: "$ZodCheckNumberFormatDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckNumberFormatInternals",
                          label: "$ZodCheckNumberFormatInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckOverwrite",
                          label: "$ZodCheckOverwrite"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckOverwriteDef",
                          label: "$ZodCheckOverwriteDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckOverwriteInternals",
                          label: "$ZodCheckOverwriteInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckProperty",
                          label: "$ZodCheckProperty"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckPropertyDef",
                          label: "$ZodCheckPropertyDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckPropertyInternals",
                          label: "$ZodCheckPropertyInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckRegex",
                          label: "$ZodCheckRegex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckRegexDef",
                          label: "$ZodCheckRegexDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckRegexInternals",
                          label: "$ZodCheckRegexInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckSizeEquals",
                          label: "$ZodCheckSizeEquals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckSizeEqualsDef",
                          label: "$ZodCheckSizeEqualsDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckSizeEqualsInternals",
                          label: "$ZodCheckSizeEqualsInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckStartsWith",
                          label: "$ZodCheckStartsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckStartsWithDef",
                          label: "$ZodCheckStartsWithDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckStartsWithInternals",
                          label: "$ZodCheckStartsWithInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckStringFormat",
                          label: "$ZodCheckStringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckStringFormatDef",
                          label: "$ZodCheckStringFormatDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckStringFormatInternals",
                          label: "$ZodCheckStringFormatInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckUpperCase",
                          label: "$ZodCheckUpperCase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckUpperCaseDef",
                          label: "$ZodCheckUpperCaseDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCheckUpperCaseInternals",
                          label: "$ZodCheckUpperCaseInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCIDRv4",
                          label: "$ZodCIDRv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCIDRv4Def",
                          label: "$ZodCIDRv4Def"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCIDRv4Internals",
                          label: "$ZodCIDRv4Internals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCIDRv6",
                          label: "$ZodCIDRv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCIDRv6Def",
                          label: "$ZodCIDRv6Def"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCIDRv6Internals",
                          label: "$ZodCIDRv6Internals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCodec",
                          label: "$ZodCodec"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCodecDef",
                          label: "$ZodCodecDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCodecInternals",
                          label: "$ZodCodecInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodConfig",
                          label: "$ZodConfig"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCUID",
                          label: "$ZodCUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCUID2",
                          label: "$ZodCUID2"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCUID2Def",
                          label: "$ZodCUID2Def"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCUID2Internals",
                          label: "$ZodCUID2Internals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCUIDDef",
                          label: "$ZodCUIDDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCUIDInternals",
                          label: "$ZodCUIDInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCustom",
                          label: "$ZodCustom"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCustomDef",
                          label: "$ZodCustomDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCustomInternals",
                          label: "$ZodCustomInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCustomStringFormat",
                          label: "$ZodCustomStringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCustomStringFormatDef",
                          label: "$ZodCustomStringFormatDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodCustomStringFormatInternals",
                          label: "$ZodCustomStringFormatInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDate",
                          label: "$ZodDate"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDateDef",
                          label: "$ZodDateDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDateInternals",
                          label: "$ZodDateInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDefault",
                          label: "$ZodDefault"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDefaultDef",
                          label: "$ZodDefaultDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDefaultInternals",
                          label: "$ZodDefaultInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDiscriminatedUnion",
                          label: "$ZodDiscriminatedUnion"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDiscriminatedUnionDef",
                          label: "$ZodDiscriminatedUnionDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodDiscriminatedUnionInternals",
                          label: "$ZodDiscriminatedUnionInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodE164",
                          label: "$ZodE164"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodE164Def",
                          label: "$ZodE164Def"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodE164Internals",
                          label: "$ZodE164Internals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEmail",
                          label: "$ZodEmail"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEmailDef",
                          label: "$ZodEmailDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEmailInternals",
                          label: "$ZodEmailInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEmoji",
                          label: "$ZodEmoji"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEmojiDef",
                          label: "$ZodEmojiDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEmojiInternals",
                          label: "$ZodEmojiInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEnum",
                          label: "$ZodEnum"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEnumDef",
                          label: "$ZodEnumDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodEnumInternals",
                          label: "$ZodEnumInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodError",
                          label: "$ZodError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodErrorMap",
                          label: "$ZodErrorMap"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodExactOptional",
                          label: "$ZodExactOptional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodExactOptionalDef",
                          label: "$ZodExactOptionalDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodExactOptionalInternals",
                          label: "$ZodExactOptionalInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodFile",
                          label: "$ZodFile"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodFileDef",
                          label: "$ZodFileDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodFileInternals",
                          label: "$ZodFileInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodFunction",
                          label: "$ZodFunction"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodFunctionDef",
                          label: "$ZodFunctionDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodFunctionInternals",
                          label: "$ZodFunctionInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodFunctionParams",
                          label: "$ZodFunctionParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodGUID",
                          label: "$ZodGUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodGUIDDef",
                          label: "$ZodGUIDDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodGUIDInternals",
                          label: "$ZodGUIDInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIntersection",
                          label: "$ZodIntersection"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIntersectionDef",
                          label: "$ZodIntersectionDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIntersectionInternals",
                          label: "$ZodIntersectionInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIPv4",
                          label: "$ZodIPv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIPv4Def",
                          label: "$ZodIPv4Def"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIPv4Internals",
                          label: "$ZodIPv4Internals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIPv6",
                          label: "$ZodIPv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIPv6Def",
                          label: "$ZodIPv6Def"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIPv6Internals",
                          label: "$ZodIPv6Internals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODate",
                          label: "$ZodISODate"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODateDef",
                          label: "$ZodISODateDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODateInternals",
                          label: "$ZodISODateInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODateTime",
                          label: "$ZodISODateTime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODateTimeDef",
                          label: "$ZodISODateTimeDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODateTimeInternals",
                          label: "$ZodISODateTimeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODuration",
                          label: "$ZodISODuration"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODurationDef",
                          label: "$ZodISODurationDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISODurationInternals",
                          label: "$ZodISODurationInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISOTime",
                          label: "$ZodISOTime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISOTimeDef",
                          label: "$ZodISOTimeDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodISOTimeInternals",
                          label: "$ZodISOTimeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueBase",
                          label: "$ZodIssueBase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueCustom",
                          label: "$ZodIssueCustom"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueInvalidElement",
                          label: "$ZodIssueInvalidElement"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueInvalidKey",
                          label: "$ZodIssueInvalidKey"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueInvalidStringFormat",
                          label: "$ZodIssueInvalidStringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueInvalidType",
                          label: "$ZodIssueInvalidType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueInvalidValue",
                          label: "$ZodIssueInvalidValue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueNotMultipleOf",
                          label: "$ZodIssueNotMultipleOf"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueStringCommonFormats",
                          label: "$ZodIssueStringCommonFormats"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueStringEndsWith",
                          label: "$ZodIssueStringEndsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueStringIncludes",
                          label: "$ZodIssueStringIncludes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueStringInvalidJWT",
                          label: "$ZodIssueStringInvalidJWT"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueStringInvalidRegex",
                          label: "$ZodIssueStringInvalidRegex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueStringStartsWith",
                          label: "$ZodIssueStringStartsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueTooBig",
                          label: "$ZodIssueTooBig"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueTooSmall",
                          label: "$ZodIssueTooSmall"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodIssueUnrecognizedKeys",
                          label: "$ZodIssueUnrecognizedKeys"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodJWT",
                          label: "$ZodJWT"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodJWTDef",
                          label: "$ZodJWTDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodJWTInternals",
                          label: "$ZodJWTInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodKSUID",
                          label: "$ZodKSUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodKSUIDDef",
                          label: "$ZodKSUIDDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodKSUIDInternals",
                          label: "$ZodKSUIDInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodLazy",
                          label: "$ZodLazy"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodLazyDef",
                          label: "$ZodLazyDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodLazyInternals",
                          label: "$ZodLazyInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodLiteral",
                          label: "$ZodLiteral"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodLiteralDef",
                          label: "$ZodLiteralDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodLiteralInternals",
                          label: "$ZodLiteralInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodMAC",
                          label: "$ZodMAC"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodMACDef",
                          label: "$ZodMACDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodMACInternals",
                          label: "$ZodMACInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodMap",
                          label: "$ZodMap"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodMapDef",
                          label: "$ZodMapDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodMapInternals",
                          label: "$ZodMapInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNaN",
                          label: "$ZodNaN"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNaNDef",
                          label: "$ZodNaNDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNaNInternals",
                          label: "$ZodNaNInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNanoID",
                          label: "$ZodNanoID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNanoIDDef",
                          label: "$ZodNanoIDDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNanoIDInternals",
                          label: "$ZodNanoIDInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNever",
                          label: "$ZodNever"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNeverDef",
                          label: "$ZodNeverDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNeverInternals",
                          label: "$ZodNeverInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNonOptional",
                          label: "$ZodNonOptional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNonOptionalDef",
                          label: "$ZodNonOptionalDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNonOptionalInternals",
                          label: "$ZodNonOptionalInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNull",
                          label: "$ZodNull"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNullable",
                          label: "$ZodNullable"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNullableDef",
                          label: "$ZodNullableDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNullableInternals",
                          label: "$ZodNullableInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNullDef",
                          label: "$ZodNullDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNullInternals",
                          label: "$ZodNullInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNumber",
                          label: "$ZodNumber"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNumberDef",
                          label: "$ZodNumberDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNumberFormat",
                          label: "$ZodNumberFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNumberFormatDef",
                          label: "$ZodNumberFormatDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNumberFormatInternals",
                          label: "$ZodNumberFormatInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodNumberInternals",
                          label: "$ZodNumberInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodObject",
                          label: "$ZodObject"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodObjectDef",
                          label: "$ZodObjectDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodObjectInternals",
                          label: "$ZodObjectInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodOptional",
                          label: "$ZodOptional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodOptionalDef",
                          label: "$ZodOptionalDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodOptionalInternals",
                          label: "$ZodOptionalInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPipe",
                          label: "$ZodPipe"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPipeDef",
                          label: "$ZodPipeDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPipeInternals",
                          label: "$ZodPipeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPrefault",
                          label: "$ZodPrefault"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPrefaultDef",
                          label: "$ZodPrefaultDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPrefaultInternals",
                          label: "$ZodPrefaultInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPromise",
                          label: "$ZodPromise"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPromiseDef",
                          label: "$ZodPromiseDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodPromiseInternals",
                          label: "$ZodPromiseInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodReadonly",
                          label: "$ZodReadonly"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodReadonlyDef",
                          label: "$ZodReadonlyDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodReadonlyInternals",
                          label: "$ZodReadonlyInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodRecord",
                          label: "$ZodRecord"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodRecordDef",
                          label: "$ZodRecordDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodRecordInternals",
                          label: "$ZodRecordInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSet",
                          label: "$ZodSet"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSetDef",
                          label: "$ZodSetDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSetInternals",
                          label: "$ZodSetInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodString",
                          label: "$ZodString"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodStringBoolParams",
                          label: "$ZodStringBoolParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodStringDef",
                          label: "$ZodStringDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodStringFormat",
                          label: "$ZodStringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodStringFormatDef",
                          label: "$ZodStringFormatDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodStringFormatInternals",
                          label: "$ZodStringFormatInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodStringInternals",
                          label: "$ZodStringInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSuccess",
                          label: "$ZodSuccess"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSuccessDef",
                          label: "$ZodSuccessDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSuccessInternals",
                          label: "$ZodSuccessInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSymbol",
                          label: "$ZodSymbol"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSymbolDef",
                          label: "$ZodSymbolDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodSymbolInternals",
                          label: "$ZodSymbolInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTemplateLiteral",
                          label: "$ZodTemplateLiteral"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTemplateLiteralDef",
                          label: "$ZodTemplateLiteralDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTemplateLiteralInternals",
                          label: "$ZodTemplateLiteralInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTransform",
                          label: "$ZodTransform"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTransformDef",
                          label: "$ZodTransformDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTransformInternals",
                          label: "$ZodTransformInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTuple",
                          label: "$ZodTuple"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTupleDef",
                          label: "$ZodTupleDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTupleInternals",
                          label: "$ZodTupleInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodType-1",
                          label: "$ZodType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeDef",
                          label: "$ZodTypeDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeDiscriminable",
                          label: "$ZodTypeDiscriminable"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeDiscriminableInternals",
                          label: "$ZodTypeDiscriminableInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodTypeInternals-1",
                          label: "$ZodTypeInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodULID",
                          label: "$ZodULID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodULIDDef",
                          label: "$ZodULIDDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodULIDInternals",
                          label: "$ZodULIDInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUndefined",
                          label: "$ZodUndefined"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUndefinedDef",
                          label: "$ZodUndefinedDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUndefinedInternals",
                          label: "$ZodUndefinedInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUnion",
                          label: "$ZodUnion"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUnionDef",
                          label: "$ZodUnionDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUnionInternals",
                          label: "$ZodUnionInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUnknown",
                          label: "$ZodUnknown"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUnknownDef",
                          label: "$ZodUnknownDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUnknownInternals",
                          label: "$ZodUnknownInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodURL",
                          label: "$ZodURL"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodURLDef",
                          label: "$ZodURLDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodURLInternals",
                          label: "$ZodURLInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUUID",
                          label: "$ZodUUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUUIDDef",
                          label: "$ZodUUIDDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodUUIDInternals",
                          label: "$ZodUUIDInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodVoid",
                          label: "$ZodVoid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodVoidDef",
                          label: "$ZodVoidDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodVoidInternals",
                          label: "$ZodVoidInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodXID",
                          label: "$ZodXID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodXIDDef",
                          label: "$ZodXIDDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodXIDInternals",
                          label: "$ZodXIDInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodXor",
                          label: "$ZodXor"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/$ZodXorInternals",
                          label: "$ZodXorInternals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/File",
                          label: "File"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/GlobalMeta",
                          label: "GlobalMeta"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/JSONSchemaGeneratorParams",
                          label: "JSONSchemaGeneratorParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/JSONSchemaMeta",
                          label: "JSONSchemaMeta"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/ParseContext",
                          label: "ParseContext"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/ParseContextInternal",
                          label: "ParseContextInternal"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/ParsePayload",
                          label: "ParsePayload"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/ProcessParams",
                          label: "ProcessParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/RegistryToJSONSchemaParams",
                          label: "RegistryToJSONSchemaParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/Seen",
                          label: "Seen"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/ToJSONSchemaContext",
                          label: "ToJSONSchemaContext"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/interfaces/ZodStandardJSONSchemaPayload",
                          label: "ZodStandardJSONSchemaPayload"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Type Aliases",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$brand",
                          label: "$brand"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$catchall",
                          label: "$catchall"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$Decode",
                          label: "$Decode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$DecodeAsync",
                          label: "$DecodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$Encode",
                          label: "$Encode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$EncodeAsync",
                          label: "$EncodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferEnumInput",
                          label: "$InferEnumInput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferEnumOutput",
                          label: "$InferEnumOutput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferInnerFunctionType",
                          label: "$InferInnerFunctionType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferInnerFunctionTypeAsync",
                          label: "$InferInnerFunctionTypeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferObjectInput",
                          label: "$InferObjectInput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferObjectOutput",
                          label: "$InferObjectOutput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferOuterFunctionType",
                          label: "$InferOuterFunctionType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferOuterFunctionTypeAsync",
                          label: "$InferOuterFunctionTypeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferTupleInputType",
                          label: "$InferTupleInputType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferTupleOutputType",
                          label: "$InferTupleOutputType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferUnionInput",
                          label: "$InferUnionInput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferUnionOutput",
                          label: "$InferUnionOutput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferZodRecordInput",
                          label: "$InferZodRecordInput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$InferZodRecordOutput",
                          label: "$InferZodRecordOutput"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$input",
                          label: "$input"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$loose",
                          label: "$loose"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$output",
                          label: "$output"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$Parse",
                          label: "$Parse"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ParseAsync",
                          label: "$ParseAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$partial",
                          label: "$partial"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$PartsToTemplateLiteral",
                          label: "$PartsToTemplateLiteral"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$replace",
                          label: "$replace"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$SafeDecode",
                          label: "$SafeDecode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$SafeDecodeAsync",
                          label: "$SafeDecodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$SafeEncode",
                          label: "$SafeEncode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$SafeEncodeAsync",
                          label: "$SafeEncodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$SafeParse",
                          label: "$SafeParse"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$SafeParseAsync",
                          label: "$SafeParseAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$strict",
                          label: "$strict"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$strip",
                          label: "$strip"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodAnyParams",
                          label: "$ZodAnyParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodArrayParams",
                          label: "$ZodArrayParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodBase64Params",
                          label: "$ZodBase64Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodBase64URLParams",
                          label: "$ZodBase64URLParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodBigIntFormatParams",
                          label: "$ZodBigIntFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodBigIntFormats",
                          label: "$ZodBigIntFormats"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodBigIntParams",
                          label: "$ZodBigIntParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodBooleanParams",
                          label: "$ZodBooleanParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodBranded",
                          label: "$ZodBranded"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCatchParams",
                          label: "$ZodCatchParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckBase64Params",
                          label: "$ZodCheckBase64Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckBase64URLParams",
                          label: "$ZodCheckBase64URLParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckBigIntFormatParams",
                          label: "$ZodCheckBigIntFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckCIDRv4Params",
                          label: "$ZodCheckCIDRv4Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckCIDRv6Params",
                          label: "$ZodCheckCIDRv6Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckCUID2Params",
                          label: "$ZodCheckCUID2Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckCUIDParams",
                          label: "$ZodCheckCUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckE164Params",
                          label: "$ZodCheckE164Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckEmailParams",
                          label: "$ZodCheckEmailParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckEmojiParams",
                          label: "$ZodCheckEmojiParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckEndsWithParams",
                          label: "$ZodCheckEndsWithParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckGreaterThanParams",
                          label: "$ZodCheckGreaterThanParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckGUIDParams",
                          label: "$ZodCheckGUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckIncludesParams",
                          label: "$ZodCheckIncludesParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckIPv4Params",
                          label: "$ZodCheckIPv4Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckIPv6Params",
                          label: "$ZodCheckIPv6Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckISODateParams",
                          label: "$ZodCheckISODateParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckISODateTimeParams",
                          label: "$ZodCheckISODateTimeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckISODurationParams",
                          label: "$ZodCheckISODurationParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckISOTimeParams",
                          label: "$ZodCheckISOTimeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckJWTParams",
                          label: "$ZodCheckJWTParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckKSUIDParams",
                          label: "$ZodCheckKSUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckLengthEqualsParams",
                          label: "$ZodCheckLengthEqualsParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckLessThanParams",
                          label: "$ZodCheckLessThanParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckLowerCaseParams",
                          label: "$ZodCheckLowerCaseParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckMACParams",
                          label: "$ZodCheckMACParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckMaxLengthParams",
                          label: "$ZodCheckMaxLengthParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckMaxSizeParams",
                          label: "$ZodCheckMaxSizeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckMimeTypeParams",
                          label: "$ZodCheckMimeTypeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckMinLengthParams",
                          label: "$ZodCheckMinLengthParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckMinSizeParams",
                          label: "$ZodCheckMinSizeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckMultipleOfParams",
                          label: "$ZodCheckMultipleOfParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckNanoIDParams",
                          label: "$ZodCheckNanoIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckNumberFormatParams",
                          label: "$ZodCheckNumberFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckPropertyParams",
                          label: "$ZodCheckPropertyParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckRegexParams",
                          label: "$ZodCheckRegexParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodChecks",
                          label: "$ZodChecks"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckSizeEqualsParams",
                          label: "$ZodCheckSizeEqualsParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckStartsWithParams",
                          label: "$ZodCheckStartsWithParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckStringFormatParams",
                          label: "$ZodCheckStringFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckULIDParams",
                          label: "$ZodCheckULIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckUpperCaseParams",
                          label: "$ZodCheckUpperCaseParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckURLParams",
                          label: "$ZodCheckURLParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckUUIDParams",
                          label: "$ZodCheckUUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckUUIDv4Params",
                          label: "$ZodCheckUUIDv4Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckUUIDv6Params",
                          label: "$ZodCheckUUIDv6Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckUUIDv7Params",
                          label: "$ZodCheckUUIDv7Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCheckXIDParams",
                          label: "$ZodCheckXIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCIDRv4Params",
                          label: "$ZodCIDRv4Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCIDRv6Params",
                          label: "$ZodCIDRv6Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCUID2Params",
                          label: "$ZodCUID2Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCUIDParams",
                          label: "$ZodCUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodCustomParams",
                          label: "$ZodCustomParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodDateParams",
                          label: "$ZodDateParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodDefaultParams",
                          label: "$ZodDefaultParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodDiscriminatedUnionParams",
                          label: "$ZodDiscriminatedUnionParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodE164Params",
                          label: "$ZodE164Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodEmailParams",
                          label: "$ZodEmailParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodEmojiParams",
                          label: "$ZodEmojiParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodEnumParams",
                          label: "$ZodEnumParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodErrorClass",
                          label: "$ZodErrorClass"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodErrorTree",
                          label: "$ZodErrorTree"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodFileParams",
                          label: "$ZodFileParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodFlattenedError",
                          label: "$ZodFlattenedError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodFormattedError",
                          label: "$ZodFormattedError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodFunctionArgs",
                          label: "$ZodFunctionArgs"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodFunctionIn",
                          label: "$ZodFunctionIn"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodFunctionOut",
                          label: "$ZodFunctionOut"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodGUIDParams",
                          label: "$ZodGUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodInternalIssue",
                          label: "$ZodInternalIssue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodIntersectionParams",
                          label: "$ZodIntersectionParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodInvalidTypeExpected",
                          label: "$ZodInvalidTypeExpected"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodIPv4Params",
                          label: "$ZodIPv4Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodIPv6Params",
                          label: "$ZodIPv6Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodISODateParams",
                          label: "$ZodISODateParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodISODateTimeParams",
                          label: "$ZodISODateTimeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodISODurationParams",
                          label: "$ZodISODurationParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodISOTimeParams",
                          label: "$ZodISOTimeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodIssue",
                          label: "$ZodIssue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodIssueCode",
                          label: "$ZodIssueCode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodIssueInvalidUnion",
                          label: "$ZodIssueInvalidUnion"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodJWTParams",
                          label: "$ZodJWTParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodKSUIDParams",
                          label: "$ZodKSUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodLazyParams",
                          label: "$ZodLazyParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodLiteralParams",
                          label: "$ZodLiteralParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodLooseShape",
                          label: "$ZodLooseShape"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodMACParams",
                          label: "$ZodMACParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodMapParams",
                          label: "$ZodMapParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNanoIDParams",
                          label: "$ZodNanoIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNaNParams",
                          label: "$ZodNaNParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNarrow",
                          label: "$ZodNarrow"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNeverParams",
                          label: "$ZodNeverParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNonOptionalParams",
                          label: "$ZodNonOptionalParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNullableParams",
                          label: "$ZodNullableParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNullParams",
                          label: "$ZodNullParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNumberFormatParams",
                          label: "$ZodNumberFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNumberFormats",
                          label: "$ZodNumberFormats"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodNumberParams",
                          label: "$ZodNumberParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodObjectConfig",
                          label: "$ZodObjectConfig"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodObjectParams",
                          label: "$ZodObjectParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodOptionalParams",
                          label: "$ZodOptionalParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodPipeParams",
                          label: "$ZodPipeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodPromiseParams",
                          label: "$ZodPromiseParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodRawIssue",
                          label: "$ZodRawIssue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodReadonlyParams",
                          label: "$ZodReadonlyParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodRecordKey",
                          label: "$ZodRecordKey"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodRecordParams",
                          label: "$ZodRecordParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodSetParams",
                          label: "$ZodSetParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodShape",
                          label: "$ZodShape"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodStandardSchema",
                          label: "$ZodStandardSchema"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodStringFormatChecks",
                          label: "$ZodStringFormatChecks"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodStringFormatIssues",
                          label: "$ZodStringFormatIssues"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodStringFormatParams",
                          label: "$ZodStringFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodStringFormats",
                          label: "$ZodStringFormats"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodStringFormatTypes",
                          label: "$ZodStringFormatTypes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodStringParams",
                          label: "$ZodStringParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodSuccessParams",
                          label: "$ZodSuccessParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodSuperRefineIssue",
                          label: "$ZodSuperRefineIssue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodSymbolParams",
                          label: "$ZodSymbolParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodTemplateLiteralParams",
                          label: "$ZodTemplateLiteralParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodTemplateLiteralPart",
                          label: "$ZodTemplateLiteralPart"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodTransformParams",
                          label: "$ZodTransformParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodTupleParams",
                          label: "$ZodTupleParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodTypes",
                          label: "$ZodTypes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodULIDParams",
                          label: "$ZodULIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodUndefinedParams",
                          label: "$ZodUndefinedParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodUnionParams",
                          label: "$ZodUnionParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodUnknownParams",
                          label: "$ZodUnknownParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodURLParams",
                          label: "$ZodURLParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodUUIDParams",
                          label: "$ZodUUIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodUUIDv4Params",
                          label: "$ZodUUIDv4Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodUUIDv6Params",
                          label: "$ZodUUIDv6Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodUUIDv7Params",
                          label: "$ZodUUIDv7Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodVoidParams",
                          label: "$ZodVoidParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodXIDParams",
                          label: "$ZodXIDParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/$ZodXorParams",
                          label: "$ZodXorParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/CheckFn",
                          label: "CheckFn"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/CheckParams",
                          label: "CheckParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/CheckStringFormatParams",
                          label: "CheckStringFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/CheckTypeParams",
                          label: "CheckTypeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/ConcatenateTupleOfStrings",
                          label: "ConcatenateTupleOfStrings"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/ConvertPartsToStringTuple",
                          label: "ConvertPartsToStringTuple"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/input",
                          label: "input"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/output",
                          label: "output"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/Params",
                          label: "Params"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/Processor",
                          label: "Processor"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/SomeType",
                          label: "SomeType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/StringFormatParams",
                          label: "StringFormatParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/ToJSONSchemaParams",
                          label: "ToJSONSchemaParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/ToTemplateLiteral",
                          label: "ToTemplateLiteral"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/TypeParams",
                          label: "TypeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/type-aliases/ZodStandardSchemaWithJSON",
                          label: "ZodStandardSchemaWithJSON"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Variables",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/decode",
                          label: "_decode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/decodeAsync",
                          label: "_decodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/encode",
                          label: "_encode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/encodeAsync",
                          label: "_encodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/parse",
                          label: "_parse"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/parseAsync",
                          label: "_parseAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeDecode",
                          label: "_safeDecode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeDecodeAsync",
                          label: "_safeDecodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeEncode",
                          label: "_safeEncode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeEncodeAsync",
                          label: "_safeEncodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeParse",
                          label: "_safeParse"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeParseAsync",
                          label: "_safeParseAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$brand",
                          label: "$brand"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$input",
                          label: "$input"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$output",
                          label: "$output"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodAny",
                          label: "$ZodAny"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodArray",
                          label: "$ZodArray"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodBase64",
                          label: "$ZodBase64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodBase64URL",
                          label: "$ZodBase64URL"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodBigInt",
                          label: "$ZodBigInt"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodBigIntFormat",
                          label: "$ZodBigIntFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodBoolean",
                          label: "$ZodBoolean"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCatch",
                          label: "$ZodCatch"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheck",
                          label: "$ZodCheck"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckBigIntFormat",
                          label: "$ZodCheckBigIntFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckEndsWith",
                          label: "$ZodCheckEndsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckGreaterThan",
                          label: "$ZodCheckGreaterThan"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckIncludes",
                          label: "$ZodCheckIncludes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckLengthEquals",
                          label: "$ZodCheckLengthEquals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckLessThan",
                          label: "$ZodCheckLessThan"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckLowerCase",
                          label: "$ZodCheckLowerCase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckMaxLength",
                          label: "$ZodCheckMaxLength"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckMaxSize",
                          label: "$ZodCheckMaxSize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckMimeType",
                          label: "$ZodCheckMimeType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckMinLength",
                          label: "$ZodCheckMinLength"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckMinSize",
                          label: "$ZodCheckMinSize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckMultipleOf",
                          label: "$ZodCheckMultipleOf"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckNumberFormat",
                          label: "$ZodCheckNumberFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckOverwrite",
                          label: "$ZodCheckOverwrite"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckProperty",
                          label: "$ZodCheckProperty"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckRegex",
                          label: "$ZodCheckRegex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckSizeEquals",
                          label: "$ZodCheckSizeEquals"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckStartsWith",
                          label: "$ZodCheckStartsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckStringFormat",
                          label: "$ZodCheckStringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCheckUpperCase",
                          label: "$ZodCheckUpperCase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCIDRv4",
                          label: "$ZodCIDRv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCIDRv6",
                          label: "$ZodCIDRv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCodec",
                          label: "$ZodCodec"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCUID",
                          label: "$ZodCUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCUID2",
                          label: "$ZodCUID2"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCustom",
                          label: "$ZodCustom"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodCustomStringFormat",
                          label: "$ZodCustomStringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodDate",
                          label: "$ZodDate"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodDefault",
                          label: "$ZodDefault"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodDiscriminatedUnion",
                          label: "$ZodDiscriminatedUnion"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodE164",
                          label: "$ZodE164"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodEmail",
                          label: "$ZodEmail"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodEmoji",
                          label: "$ZodEmoji"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodEnum",
                          label: "$ZodEnum"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodError",
                          label: "$ZodError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodExactOptional",
                          label: "$ZodExactOptional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodFile",
                          label: "$ZodFile"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodFunction",
                          label: "$ZodFunction"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodGUID",
                          label: "$ZodGUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodIntersection",
                          label: "$ZodIntersection"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodIPv4",
                          label: "$ZodIPv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodIPv6",
                          label: "$ZodIPv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodISODate",
                          label: "$ZodISODate"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodISODateTime",
                          label: "$ZodISODateTime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodISODuration",
                          label: "$ZodISODuration"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodISOTime",
                          label: "$ZodISOTime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodJWT",
                          label: "$ZodJWT"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodKSUID",
                          label: "$ZodKSUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodLazy",
                          label: "$ZodLazy"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodLiteral",
                          label: "$ZodLiteral"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodMAC",
                          label: "$ZodMAC"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodMap",
                          label: "$ZodMap"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNaN",
                          label: "$ZodNaN"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNanoID",
                          label: "$ZodNanoID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNever",
                          label: "$ZodNever"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNonOptional",
                          label: "$ZodNonOptional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNull",
                          label: "$ZodNull"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNullable",
                          label: "$ZodNullable"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNumber",
                          label: "$ZodNumber"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodNumberFormat",
                          label: "$ZodNumberFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodObject",
                          label: "$ZodObject"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodObjectJIT",
                          label: "$ZodObjectJIT"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodOptional",
                          label: "$ZodOptional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodPipe",
                          label: "$ZodPipe"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodPrefault",
                          label: "$ZodPrefault"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodPromise",
                          label: "$ZodPromise"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodReadonly",
                          label: "$ZodReadonly"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodRealError",
                          label: "$ZodRealError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodRecord",
                          label: "$ZodRecord"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodSet",
                          label: "$ZodSet"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodString",
                          label: "$ZodString"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodStringFormat",
                          label: "$ZodStringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodSuccess",
                          label: "$ZodSuccess"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodSymbol",
                          label: "$ZodSymbol"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodTemplateLiteral",
                          label: "$ZodTemplateLiteral"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodTransform",
                          label: "$ZodTransform"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodTuple",
                          label: "$ZodTuple"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodType",
                          label: "$ZodType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodULID",
                          label: "$ZodULID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodUndefined",
                          label: "$ZodUndefined"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodUnion",
                          label: "$ZodUnion"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodUnknown",
                          label: "$ZodUnknown"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodURL",
                          label: "$ZodURL"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodUUID",
                          label: "$ZodUUID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodVoid",
                          label: "$ZodVoid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodXID",
                          label: "$ZodXID"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/$ZodXor",
                          label: "$ZodXor"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/createStandardJSONSchemaMethod",
                          label: "createStandardJSONSchemaMethod"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/createToJSONSchemaMethod",
                          label: "createToJSONSchemaMethod"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/decode-1",
                          label: "decode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/decodeAsync-1",
                          label: "decodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/encode-1",
                          label: "encode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/encodeAsync-1",
                          label: "encodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/globalConfig",
                          label: "globalConfig"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/globalRegistry",
                          label: "globalRegistry"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/NEVER",
                          label: "NEVER"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/parse-1",
                          label: "parse"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/parseAsync-1",
                          label: "parseAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeDecode-1",
                          label: "safeDecode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeDecodeAsync-1",
                          label: "safeDecodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeEncode-1",
                          label: "safeEncode"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeEncodeAsync-1",
                          label: "safeEncodeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeParse-1",
                          label: "safeParse"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/safeParseAsync-1",
                          label: "safeParseAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/TimePrecision",
                          label: "TimePrecision"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/variables/version",
                          label: "version"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Functions",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/any",
                          label: "_any"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/array",
                          label: "_array"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/base64",
                          label: "_base64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/base64url",
                          label: "_base64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/bigint",
                          label: "_bigint"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/boolean",
                          label: "_boolean"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/catch",
                          label: "_catch"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/check",
                          label: "_check"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/cidrv4",
                          label: "_cidrv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/cidrv6",
                          label: "_cidrv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/coercedBigint",
                          label: "_coercedBigint"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/coercedBoolean",
                          label: "_coercedBoolean"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/coercedDate",
                          label: "_coercedDate"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/coercedNumber",
                          label: "_coercedNumber"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/coercedString",
                          label: "_coercedString"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/cuid",
                          label: "_cuid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/cuid2",
                          label: "_cuid2"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/custom",
                          label: "_custom"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/date",
                          label: "_date"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/default",
                          label: "_default"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/discriminatedUnion",
                          label: "_discriminatedUnion"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/e164",
                          label: "_e164"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/email",
                          label: "_email"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/emoji",
                          label: "_emoji"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/endsWith",
                          label: "_endsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/enum",
                          label: "_enum"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/file",
                          label: "_file"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/float32",
                          label: "_float32"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/float64",
                          label: "_float64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/gt",
                          label: "_gt"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/gte",
                          label: "_gte"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/guid",
                          label: "_guid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/includes",
                          label: "_includes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/int",
                          label: "_int"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/int32",
                          label: "_int32"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/int64",
                          label: "_int64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/intersection",
                          label: "_intersection"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/ipv4",
                          label: "_ipv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/ipv6",
                          label: "_ipv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/isoDate",
                          label: "_isoDate"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/isoDateTime",
                          label: "_isoDateTime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/isoDuration",
                          label: "_isoDuration"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/isoTime",
                          label: "_isoTime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/jwt",
                          label: "_jwt"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/ksuid",
                          label: "_ksuid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/lazy",
                          label: "_lazy"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/length",
                          label: "_length"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/literal",
                          label: "_literal"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/lowercase",
                          label: "_lowercase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/lt",
                          label: "_lt"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/lte",
                          label: "_lte"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/mac",
                          label: "_mac"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/map",
                          label: "_map"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/maxLength",
                          label: "_maxLength"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/maxSize",
                          label: "_maxSize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/mime",
                          label: "_mime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/minLength",
                          label: "_minLength"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/minSize",
                          label: "_minSize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/multipleOf",
                          label: "_multipleOf"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/nan",
                          label: "_nan"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/nanoid",
                          label: "_nanoid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/nativeEnum",
                          label: "_nativeEnum",
                          className: "typedoc-sidebar-item-deprecated"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/negative",
                          label: "_negative"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/never",
                          label: "_never"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/nonnegative",
                          label: "_nonnegative"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/nonoptional",
                          label: "_nonoptional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/nonpositive",
                          label: "_nonpositive"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/normalize",
                          label: "_normalize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/null",
                          label: "_null"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/nullable",
                          label: "_nullable"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/number",
                          label: "_number"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/optional",
                          label: "_optional"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/overwrite",
                          label: "_overwrite"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/pipe",
                          label: "_pipe"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/positive",
                          label: "_positive"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/promise",
                          label: "_promise"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/property",
                          label: "_property"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/readonly",
                          label: "_readonly"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/record",
                          label: "_record"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/refine",
                          label: "_refine"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/regex",
                          label: "_regex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/set",
                          label: "_set"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/size",
                          label: "_size"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/slugify",
                          label: "_slugify"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/startsWith",
                          label: "_startsWith"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/string",
                          label: "_string"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/stringbool",
                          label: "_stringbool"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/stringFormat",
                          label: "_stringFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/success",
                          label: "_success"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/superRefine",
                          label: "_superRefine"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/symbol",
                          label: "_symbol"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/templateLiteral",
                          label: "_templateLiteral"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/toLowerCase",
                          label: "_toLowerCase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/toUpperCase",
                          label: "_toUpperCase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/transform",
                          label: "_transform"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/trim",
                          label: "_trim"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/tuple",
                          label: "_tuple"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/uint32",
                          label: "_uint32"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/uint64",
                          label: "_uint64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/ulid",
                          label: "_ulid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/undefined",
                          label: "_undefined"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/union",
                          label: "_union"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/unknown",
                          label: "_unknown"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/uppercase",
                          label: "_uppercase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/url",
                          label: "_url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/uuid",
                          label: "_uuid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/uuidv4",
                          label: "_uuidv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/uuidv6",
                          label: "_uuidv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/uuidv7",
                          label: "_uuidv7"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/void",
                          label: "_void"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/xid",
                          label: "_xid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/xor",
                          label: "_xor"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/$constructor",
                          label: "$constructor"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/config",
                          label: "config"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/describe",
                          label: "describe"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/extractDefs",
                          label: "extractDefs"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/finalize",
                          label: "finalize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/flattenError",
                          label: "flattenError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/formatError",
                          label: "formatError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/initializeContext",
                          label: "initializeContext"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/isValidBase64",
                          label: "isValidBase64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/isValidBase64URL",
                          label: "isValidBase64URL"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/isValidJWT",
                          label: "isValidJWT"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/meta",
                          label: "meta"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/prettifyError",
                          label: "prettifyError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/process",
                          label: "process"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/registry",
                          label: "registry"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/toDotPath",
                          label: "toDotPath"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/core/functions/treeifyError",
                          label: "treeifyError"
                        }
                      ]
                    }
                  ],
                  link: {
                    type: "doc",
                    id: "api/@framers/namespaces/z/namespaces/core/index"
                  }
                },
                {
                  type: "category",
                  label: "iso",
                  items: [
                    {
                      type: "category",
                      label: "Functions",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/iso/functions/date",
                          label: "date"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/iso/functions/datetime",
                          label: "datetime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/iso/functions/duration",
                          label: "duration"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/iso/functions/time",
                          label: "time"
                        }
                      ]
                    }
                  ],
                  link: {
                    type: "doc",
                    id: "api/@framers/namespaces/z/namespaces/iso/index"
                  }
                },
                {
                  type: "category",
                  label: "locales",
                  items: [
                    {
                      type: "category",
                      label: "Functions",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ar",
                          label: "ar"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/az",
                          label: "az"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/be",
                          label: "be"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/bg",
                          label: "bg"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ca",
                          label: "ca"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/cs",
                          label: "cs"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/da",
                          label: "da"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/de",
                          label: "de"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/en",
                          label: "en"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/eo",
                          label: "eo"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/es",
                          label: "es"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/fa",
                          label: "fa"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/fi",
                          label: "fi"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/fr",
                          label: "fr"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/frCA",
                          label: "frCA"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/he",
                          label: "he"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/hu",
                          label: "hu"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/hy",
                          label: "hy"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/id",
                          label: "id"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/is",
                          label: "is"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/it",
                          label: "it"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ja",
                          label: "ja"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ka",
                          label: "ka"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/kh",
                          label: "kh"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/km",
                          label: "km"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ko",
                          label: "ko"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/lt",
                          label: "lt"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/mk",
                          label: "mk"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ms",
                          label: "ms"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/nl",
                          label: "nl"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/no",
                          label: "no"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ota",
                          label: "ota"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/pl",
                          label: "pl"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ps",
                          label: "ps"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/pt",
                          label: "pt"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ru",
                          label: "ru"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/sl",
                          label: "sl"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/sv",
                          label: "sv"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ta",
                          label: "ta"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/th",
                          label: "th"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/tr",
                          label: "tr"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ua",
                          label: "ua"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/uk",
                          label: "uk"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/ur",
                          label: "ur"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/uz",
                          label: "uz"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/vi",
                          label: "vi"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/yo",
                          label: "yo"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/zhCN",
                          label: "zhCN"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/locales/functions/zhTW",
                          label: "zhTW"
                        }
                      ]
                    }
                  ],
                  link: {
                    type: "doc",
                    id: "api/@framers/namespaces/z/namespaces/locales/index"
                  }
                },
                {
                  type: "category",
                  label: "regexes",
                  items: [
                    {
                      type: "category",
                      label: "Variables",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/base64",
                          label: "base64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/base64url",
                          label: "base64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/bigint",
                          label: "bigint"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/boolean",
                          label: "boolean"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/browserEmail",
                          label: "browserEmail"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/cidrv4",
                          label: "cidrv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/cidrv6",
                          label: "cidrv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/cuid",
                          label: "cuid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/cuid2",
                          label: "cuid2"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/date",
                          label: "date"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/domain",
                          label: "domain"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/duration",
                          label: "duration"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/e164",
                          label: "e164"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/email",
                          label: "email"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/extendedDuration",
                          label: "extendedDuration"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/guid",
                          label: "guid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/hex",
                          label: "hex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/hostname",
                          label: "hostname"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/html5Email",
                          label: "html5Email"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/idnEmail",
                          label: "idnEmail"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/integer",
                          label: "integer"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/ipv4",
                          label: "ipv4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/ipv6",
                          label: "ipv6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/ksuid",
                          label: "ksuid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/lowercase",
                          label: "lowercase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/mac",
                          label: "mac"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/md5_base64",
                          label: "md5_base64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/md5_base64url",
                          label: "md5_base64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/md5_hex",
                          label: "md5_hex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/nanoid",
                          label: "nanoid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/null",
                          label: "null"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/number",
                          label: "number"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/rfc5322Email",
                          label: "rfc5322Email"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha1_base64",
                          label: "sha1_base64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha1_base64url",
                          label: "sha1_base64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha1_hex",
                          label: "sha1_hex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha256_base64",
                          label: "sha256_base64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha256_base64url",
                          label: "sha256_base64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha256_hex",
                          label: "sha256_hex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha384_base64",
                          label: "sha384_base64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha384_base64url",
                          label: "sha384_base64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha384_hex",
                          label: "sha384_hex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha512_base64",
                          label: "sha512_base64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha512_base64url",
                          label: "sha512_base64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/sha512_hex",
                          label: "sha512_hex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/string",
                          label: "string"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/ulid",
                          label: "ulid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/undefined",
                          label: "undefined"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/unicodeEmail",
                          label: "unicodeEmail"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/uppercase",
                          label: "uppercase"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/uuid",
                          label: "uuid"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/uuid4",
                          label: "uuid4"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/uuid6",
                          label: "uuid6"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/uuid7",
                          label: "uuid7"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/variables/xid",
                          label: "xid"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Functions",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/functions/datetime",
                          label: "datetime"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/functions/emoji",
                          label: "emoji"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/regexes/functions/time",
                          label: "time"
                        }
                      ]
                    }
                  ],
                  link: {
                    type: "doc",
                    id: "api/@framers/namespaces/z/namespaces/regexes/index"
                  }
                },
                {
                  type: "category",
                  label: "util",
                  items: [
                    {
                      type: "category",
                      label: "Classes",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/classes/Class",
                          label: "Class"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Type Aliases",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/AnyFunc",
                          label: "AnyFunc"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/AssertEqual",
                          label: "AssertEqual"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/AssertExtends",
                          label: "AssertExtends"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/AssertNotEqual",
                          label: "AssertNotEqual"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/BuiltIn",
                          label: "BuiltIn"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/CleanKey",
                          label: "CleanKey"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Constructor",
                          label: "Constructor"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/EmptyObject",
                          label: "EmptyObject"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/EmptyToNever",
                          label: "EmptyToNever"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/EnumLike",
                          label: "EnumLike"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/EnumValue",
                          label: "EnumValue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Exactly",
                          label: "Exactly"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Extend",
                          label: "Extend"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/ExtractIndexSignature",
                          label: "ExtractIndexSignature"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Flatten",
                          label: "Flatten"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/FromCleanMap",
                          label: "FromCleanMap"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/HashAlgorithm",
                          label: "HashAlgorithm"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/HashEncoding",
                          label: "HashEncoding"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/HashFormat",
                          label: "HashFormat"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/HasLength",
                          label: "HasLength"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/HasSize",
                          label: "HasSize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Identity",
                          label: "Identity"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/InexactPartial",
                          label: "InexactPartial"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/IPVersion",
                          label: "IPVersion"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/IsAny",
                          label: "IsAny"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/IsProp",
                          label: "IsProp"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/JSONType",
                          label: "JSONType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/JWTAlgorithm",
                          label: "JWTAlgorithm"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/KeyOf",
                          label: "KeyOf"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Keys",
                          label: "Keys"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/KeysArray",
                          label: "KeysArray"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/KeysEnum",
                          label: "KeysEnum"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Literal",
                          label: "Literal"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/LiteralArray",
                          label: "LiteralArray"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/LoosePartial",
                          label: "LoosePartial"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/MakePartial",
                          label: "MakePartial"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/MakeReadonly",
                          label: "MakeReadonly"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/MakeRequired",
                          label: "MakeRequired"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Mapped",
                          label: "Mapped"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Mask",
                          label: "Mask"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/MaybeAsync",
                          label: "MaybeAsync"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/MimeTypes",
                          label: "MimeTypes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/NoNever",
                          label: "NoNever"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/NoNeverKeys",
                          label: "NoNeverKeys"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Normalize",
                          label: "Normalize"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/NoUndefined",
                          label: "NoUndefined"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Numeric",
                          label: "Numeric"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Omit",
                          label: "Omit"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/OmitIndexSignature",
                          label: "OmitIndexSignature"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/OmitKeys",
                          label: "OmitKeys"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/ParsedTypes",
                          label: "ParsedTypes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Prettify",
                          label: "Prettify"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Primitive",
                          label: "Primitive"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/PrimitiveArray",
                          label: "PrimitiveArray"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/PrimitiveSet",
                          label: "PrimitiveSet"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/PropValues",
                          label: "PropValues"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/SafeParseError",
                          label: "SafeParseError"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/SafeParseResult",
                          label: "SafeParseResult"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/SafeParseSuccess",
                          label: "SafeParseSuccess"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/SchemaClass",
                          label: "SchemaClass"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/SomeObject",
                          label: "SomeObject"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/ToCleanMap",
                          label: "ToCleanMap"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/ToEnum",
                          label: "ToEnum"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/TupleItems",
                          label: "TupleItems"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Whatever",
                          label: "Whatever"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/type-aliases/Writeable",
                          label: "Writeable"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Variables",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/variables/allowsEval",
                          label: "allowsEval"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/variables/BIGINT_FORMAT_RANGES",
                          label: "BIGINT_FORMAT_RANGES"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/variables/captureStackTrace",
                          label: "captureStackTrace"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/variables/getParsedType",
                          label: "getParsedType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/variables/NUMBER_FORMAT_RANGES",
                          label: "NUMBER_FORMAT_RANGES"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/variables/primitiveTypes",
                          label: "primitiveTypes"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/variables/propertyKeyTypes",
                          label: "propertyKeyTypes"
                        }
                      ]
                    },
                    {
                      type: "category",
                      label: "Functions",
                      items: [
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/aborted",
                          label: "aborted"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/assert",
                          label: "assert"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/assertEqual",
                          label: "assertEqual"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/assertIs",
                          label: "assertIs"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/assertNever",
                          label: "assertNever"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/assertNotEqual",
                          label: "assertNotEqual"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/assignProp",
                          label: "assignProp"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/base64ToUint8Array",
                          label: "base64ToUint8Array"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/base64urlToUint8Array",
                          label: "base64urlToUint8Array"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/cached",
                          label: "cached"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/cleanEnum",
                          label: "cleanEnum"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/cleanRegex",
                          label: "cleanRegex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/cloneDef",
                          label: "cloneDef"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/createTransparentProxy",
                          label: "createTransparentProxy"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/defineLazy",
                          label: "defineLazy"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/esc",
                          label: "esc"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/escapeRegex",
                          label: "escapeRegex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/extend",
                          label: "extend"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/finalizeIssue",
                          label: "finalizeIssue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/floatSafeRemainder",
                          label: "floatSafeRemainder"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/getElementAtPath",
                          label: "getElementAtPath"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/getEnumValues",
                          label: "getEnumValues"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/getLengthableOrigin",
                          label: "getLengthableOrigin"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/getSizableOrigin",
                          label: "getSizableOrigin"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/hexToUint8Array",
                          label: "hexToUint8Array"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/isObject",
                          label: "isObject"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/isPlainObject",
                          label: "isPlainObject"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/issue",
                          label: "issue"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/joinValues",
                          label: "joinValues"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/jsonStringifyReplacer",
                          label: "jsonStringifyReplacer"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/merge",
                          label: "merge"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/mergeDefs",
                          label: "mergeDefs"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/normalizeParams",
                          label: "normalizeParams"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/nullish",
                          label: "nullish"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/numKeys",
                          label: "numKeys"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/objectClone",
                          label: "objectClone"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/omit",
                          label: "omit"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/optionalKeys",
                          label: "optionalKeys"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/parsedType",
                          label: "parsedType"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/partial",
                          label: "partial"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/pick",
                          label: "pick"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/prefixIssues",
                          label: "prefixIssues"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/promiseAllObject",
                          label: "promiseAllObject"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/randomString",
                          label: "randomString"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/required",
                          label: "required"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/safeExtend",
                          label: "safeExtend"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/shallowClone",
                          label: "shallowClone"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/slugify",
                          label: "slugify"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/stringifyPrimitive",
                          label: "stringifyPrimitive"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/uint8ArrayToBase64",
                          label: "uint8ArrayToBase64"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/uint8ArrayToBase64url",
                          label: "uint8ArrayToBase64url"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/uint8ArrayToHex",
                          label: "uint8ArrayToHex"
                        },
                        {
                          type: "doc",
                          id: "api/@framers/namespaces/z/namespaces/util/functions/unwrapMessage",
                          label: "unwrapMessage"
                        }
                      ]
                    }
                  ],
                  link: {
                    type: "doc",
                    id: "api/@framers/namespaces/z/namespaces/util/index"
                  }
                }
              ]
            },
            {
              type: "category",
              label: "Enumerations",
              items: [
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/enumerations/ZodFirstPartyTypeKind",
                  label: "ZodFirstPartyTypeKind",
                  className: "typedoc-sidebar-item-deprecated"
                }
              ]
            },
            {
              type: "category",
              label: "Interfaces",
              items: [
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodBigInt",
                  label: "_ZodBigInt"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodBoolean",
                  label: "_ZodBoolean"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodDate",
                  label: "_ZodDate"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNumber",
                  label: "_ZodNumber"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodString",
                  label: "_ZodString"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodType",
                  label: "_ZodType"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodAny",
                  label: "ZodAny"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodArray",
                  label: "ZodArray"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodBase64",
                  label: "ZodBase64"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodBase64URL",
                  label: "ZodBase64URL"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodBigInt-1",
                  label: "ZodBigInt"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodBigIntFormat",
                  label: "ZodBigIntFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodBoolean-1",
                  label: "ZodBoolean"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCatch",
                  label: "ZodCatch"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCIDRv4",
                  label: "ZodCIDRv4"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCIDRv6",
                  label: "ZodCIDRv6"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCodec",
                  label: "ZodCodec"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCoercedBigInt",
                  label: "ZodCoercedBigInt"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCoercedBoolean",
                  label: "ZodCoercedBoolean"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCoercedDate",
                  label: "ZodCoercedDate"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCoercedNumber",
                  label: "ZodCoercedNumber"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCoercedString",
                  label: "ZodCoercedString"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCUID",
                  label: "ZodCUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCUID2",
                  label: "ZodCUID2"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCustom",
                  label: "ZodCustom"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodCustomStringFormat",
                  label: "ZodCustomStringFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodDate-1",
                  label: "ZodDate"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodDefault",
                  label: "ZodDefault"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodDiscriminatedUnion",
                  label: "ZodDiscriminatedUnion"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodE164",
                  label: "ZodE164"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodEmail",
                  label: "ZodEmail"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodEmoji",
                  label: "ZodEmoji"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodEnum",
                  label: "ZodEnum"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodError",
                  label: "ZodError"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodExactOptional",
                  label: "ZodExactOptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodFile",
                  label: "ZodFile"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodFloat32",
                  label: "ZodFloat32"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodFloat64",
                  label: "ZodFloat64"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodFunction",
                  label: "ZodFunction"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodGUID",
                  label: "ZodGUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodInt",
                  label: "ZodInt"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodInt32",
                  label: "ZodInt32"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodIntersection",
                  label: "ZodIntersection"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodIPv4",
                  label: "ZodIPv4"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodIPv6",
                  label: "ZodIPv6"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodISODate",
                  label: "ZodISODate"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodISODateTime",
                  label: "ZodISODateTime"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodISODuration",
                  label: "ZodISODuration"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodISOTime",
                  label: "ZodISOTime"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodJSONSchema",
                  label: "ZodJSONSchema"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodJSONSchemaInternals",
                  label: "ZodJSONSchemaInternals"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodJWT",
                  label: "ZodJWT"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodKSUID",
                  label: "ZodKSUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodLazy",
                  label: "ZodLazy"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodLiteral",
                  label: "ZodLiteral"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodMAC",
                  label: "ZodMAC"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodMap",
                  label: "ZodMap"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNaN",
                  label: "ZodNaN"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNanoID",
                  label: "ZodNanoID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNever",
                  label: "ZodNever"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNonOptional",
                  label: "ZodNonOptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNull",
                  label: "ZodNull"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNullable",
                  label: "ZodNullable"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNumber-1",
                  label: "ZodNumber"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodNumberFormat",
                  label: "ZodNumberFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodObject",
                  label: "ZodObject"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodOptional",
                  label: "ZodOptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodPipe",
                  label: "ZodPipe"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodPrefault",
                  label: "ZodPrefault"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodPromise",
                  label: "ZodPromise"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodReadonly",
                  label: "ZodReadonly"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodRecord",
                  label: "ZodRecord"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodSet",
                  label: "ZodSet"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodString-1",
                  label: "ZodString"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodStringFormat",
                  label: "ZodStringFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodSuccess",
                  label: "ZodSuccess"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodSymbol",
                  label: "ZodSymbol"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodTemplateLiteral",
                  label: "ZodTemplateLiteral"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodTransform",
                  label: "ZodTransform"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodTuple",
                  label: "ZodTuple"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodType-1",
                  label: "ZodType"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodUInt32",
                  label: "ZodUInt32"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodULID",
                  label: "ZodULID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodUndefined",
                  label: "ZodUndefined"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodUnion",
                  label: "ZodUnion"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodUnknown",
                  label: "ZodUnknown"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodURL",
                  label: "ZodURL"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodUUID",
                  label: "ZodUUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodVoid",
                  label: "ZodVoid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodXID",
                  label: "ZodXID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/interfaces/ZodXor",
                  label: "ZodXor"
                }
              ]
            },
            {
              type: "category",
              label: "Type Aliases",
              items: [
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/BRAND",
                  label: "BRAND"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/inferFlattenedErrors",
                  label: "inferFlattenedErrors",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/inferFormattedError",
                  label: "inferFormattedError",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/IssueData",
                  label: "IssueData",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/SafeExtendShape",
                  label: "SafeExtendShape"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/ZodIssue",
                  label: "ZodIssue",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/ZodRawShape",
                  label: "ZodRawShape"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/ZodSafeParseError",
                  label: "ZodSafeParseError"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/ZodSafeParseResult",
                  label: "ZodSafeParseResult"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/ZodSafeParseSuccess",
                  label: "ZodSafeParseSuccess"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/type-aliases/ZodStandardSchemaWithJSON",
                  label: "ZodStandardSchemaWithJSON"
                }
              ]
            },
            {
              type: "category",
              label: "Variables",
              items: [
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodString",
                  label: "_ZodString"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/decode",
                  label: "decode"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/decodeAsync",
                  label: "decodeAsync"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/describe",
                  label: "describe"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/encode",
                  label: "encode"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/encodeAsync",
                  label: "encodeAsync"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/meta",
                  label: "meta"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/parse",
                  label: "parse"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/parseAsync",
                  label: "parseAsync"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/safeDecode",
                  label: "safeDecode"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/safeDecodeAsync",
                  label: "safeDecodeAsync"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/safeEncode",
                  label: "safeEncode"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/safeEncodeAsync",
                  label: "safeEncodeAsync"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/safeParse",
                  label: "safeParse"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/safeParseAsync",
                  label: "safeParseAsync"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/stringbool",
                  label: "stringbool"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodAny",
                  label: "ZodAny"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodArray",
                  label: "ZodArray"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodBase64",
                  label: "ZodBase64"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodBase64URL",
                  label: "ZodBase64URL"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodBigInt",
                  label: "ZodBigInt"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodBigIntFormat",
                  label: "ZodBigIntFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodBoolean",
                  label: "ZodBoolean"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCatch",
                  label: "ZodCatch"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCIDRv4",
                  label: "ZodCIDRv4"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCIDRv6",
                  label: "ZodCIDRv6"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCodec",
                  label: "ZodCodec"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCUID",
                  label: "ZodCUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCUID2",
                  label: "ZodCUID2"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCustom",
                  label: "ZodCustom"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodCustomStringFormat",
                  label: "ZodCustomStringFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodDate",
                  label: "ZodDate"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodDefault",
                  label: "ZodDefault"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodDiscriminatedUnion",
                  label: "ZodDiscriminatedUnion"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodE164",
                  label: "ZodE164"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodEmail",
                  label: "ZodEmail"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodEmoji",
                  label: "ZodEmoji"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodEnum",
                  label: "ZodEnum"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodError",
                  label: "ZodError"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodExactOptional",
                  label: "ZodExactOptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodFile",
                  label: "ZodFile"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodFunction",
                  label: "ZodFunction"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodGUID",
                  label: "ZodGUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodIntersection",
                  label: "ZodIntersection"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodIPv4",
                  label: "ZodIPv4"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodIPv6",
                  label: "ZodIPv6"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodISODate",
                  label: "ZodISODate"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodISODateTime",
                  label: "ZodISODateTime"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodISODuration",
                  label: "ZodISODuration"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodISOTime",
                  label: "ZodISOTime"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodIssueCode",
                  label: "ZodIssueCode",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodJWT",
                  label: "ZodJWT"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodKSUID",
                  label: "ZodKSUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodLazy",
                  label: "ZodLazy"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodLiteral",
                  label: "ZodLiteral"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodMAC",
                  label: "ZodMAC"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodMap",
                  label: "ZodMap"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNaN",
                  label: "ZodNaN"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNanoID",
                  label: "ZodNanoID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNever",
                  label: "ZodNever"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNonOptional",
                  label: "ZodNonOptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNull",
                  label: "ZodNull"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNullable",
                  label: "ZodNullable"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNumber",
                  label: "ZodNumber"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodNumberFormat",
                  label: "ZodNumberFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodObject",
                  label: "ZodObject"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodOptional",
                  label: "ZodOptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodPipe",
                  label: "ZodPipe"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodPrefault",
                  label: "ZodPrefault"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodPromise",
                  label: "ZodPromise"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodReadonly",
                  label: "ZodReadonly"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodRealError",
                  label: "ZodRealError"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodRecord",
                  label: "ZodRecord"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodSet",
                  label: "ZodSet"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodString-1",
                  label: "ZodString"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodStringFormat",
                  label: "ZodStringFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodSuccess",
                  label: "ZodSuccess"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodSymbol",
                  label: "ZodSymbol"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodTemplateLiteral",
                  label: "ZodTemplateLiteral"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodTransform",
                  label: "ZodTransform"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodTuple",
                  label: "ZodTuple"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodType",
                  label: "ZodType"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodULID",
                  label: "ZodULID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodUndefined",
                  label: "ZodUndefined"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodUnion",
                  label: "ZodUnion"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodUnknown",
                  label: "ZodUnknown"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodURL",
                  label: "ZodURL"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodUUID",
                  label: "ZodUUID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodVoid",
                  label: "ZodVoid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodXID",
                  label: "ZodXID"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/variables/ZodXor",
                  label: "ZodXor"
                }
              ]
            },
            {
              type: "category",
              label: "Functions",
              items: [
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/default",
                  label: "_default"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/function",
                  label: "_function"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/any",
                  label: "any"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/array",
                  label: "array"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/base64",
                  label: "base64"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/base64url",
                  label: "base64url"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/bigint",
                  label: "bigint"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/boolean",
                  label: "boolean"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/catch",
                  label: "catch"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/check",
                  label: "check"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/cidrv4",
                  label: "cidrv4"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/cidrv6",
                  label: "cidrv6"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/clone",
                  label: "clone"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/codec",
                  label: "codec"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/cuid",
                  label: "cuid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/cuid2",
                  label: "cuid2"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/custom",
                  label: "custom"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/date",
                  label: "date"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/discriminatedUnion",
                  label: "discriminatedUnion"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/e164",
                  label: "e164"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/email",
                  label: "email"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/emoji",
                  label: "emoji"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/enum",
                  label: "enum"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/exactOptional",
                  label: "exactOptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/file",
                  label: "file"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/float32",
                  label: "float32"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/float64",
                  label: "float64"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/fromJSONSchema",
                  label: "fromJSONSchema"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/getErrorMap",
                  label: "getErrorMap",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/guid",
                  label: "guid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/hash",
                  label: "hash"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/hex",
                  label: "hex"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/hostname",
                  label: "hostname"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/httpUrl",
                  label: "httpUrl"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/instanceof",
                  label: "instanceof"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/int",
                  label: "int"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/int32",
                  label: "int32"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/int64",
                  label: "int64"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/intersection",
                  label: "intersection"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/ipv4",
                  label: "ipv4"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/ipv6",
                  label: "ipv6"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/json",
                  label: "json"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/jwt",
                  label: "jwt"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/keyof",
                  label: "keyof"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/ksuid",
                  label: "ksuid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/lazy",
                  label: "lazy"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/literal",
                  label: "literal"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/looseObject",
                  label: "looseObject"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/looseRecord",
                  label: "looseRecord"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/mac",
                  label: "mac"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/map",
                  label: "map"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/nan",
                  label: "nan"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/nanoid",
                  label: "nanoid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/nativeEnum",
                  label: "nativeEnum",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/never",
                  label: "never"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/nonoptional",
                  label: "nonoptional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/null",
                  label: "null"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/nullable",
                  label: "nullable"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/nullish",
                  label: "nullish"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/number",
                  label: "number"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/object",
                  label: "object"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/optional",
                  label: "optional"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/partialRecord",
                  label: "partialRecord"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/pipe",
                  label: "pipe"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/prefault",
                  label: "prefault"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/preprocess",
                  label: "preprocess"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/promise",
                  label: "promise"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/readonly",
                  label: "readonly"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/record",
                  label: "record"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/refine",
                  label: "refine"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/set",
                  label: "set"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/setErrorMap",
                  label: "setErrorMap",
                  className: "typedoc-sidebar-item-deprecated"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/strictObject",
                  label: "strictObject"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/string",
                  label: "string"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/stringFormat",
                  label: "stringFormat"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/success",
                  label: "success"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/superRefine",
                  label: "superRefine"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/symbol",
                  label: "symbol"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/templateLiteral",
                  label: "templateLiteral"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/toJSONSchema",
                  label: "toJSONSchema"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/transform",
                  label: "transform"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/tuple",
                  label: "tuple"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/uint32",
                  label: "uint32"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/uint64",
                  label: "uint64"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/ulid",
                  label: "ulid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/undefined",
                  label: "undefined"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/union",
                  label: "union"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/unknown",
                  label: "unknown"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/url",
                  label: "url"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/uuid",
                  label: "uuid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/uuidv4",
                  label: "uuidv4"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/uuidv6",
                  label: "uuidv6"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/uuidv7",
                  label: "uuidv7"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/void",
                  label: "void"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/xid",
                  label: "xid"
                },
                {
                  type: "doc",
                  id: "api/@framers/namespaces/z/functions/xor",
                  label: "xor"
                }
              ]
            }
          ],
          link: {
            type: "doc",
            id: "api/@framers/namespaces/z/index"
          }
        },
        {
          type: "doc",
          id: "api/enumerations/AgentOSResponseChunkType",
          label: "AgentOSResponseChunkType"
        },
        {
          type: "doc",
          id: "api/enumerations/ContextualElementType",
          label: "ContextualElementType"
        },
        {
          type: "doc",
          id: "api/enumerations/GMIInteractionType",
          label: "GMIInteractionType"
        },
        {
          type: "doc",
          id: "api/enumerations/GMIMood",
          label: "GMIMood"
        },
        {
          type: "doc",
          id: "api/enumerations/GMIOutputChunkType",
          label: "GMIOutputChunkType"
        },
        {
          type: "doc",
          id: "api/enumerations/GMIPrimeState",
          label: "GMIPrimeState"
        },
        {
          type: "doc",
          id: "api/enumerations/GuardrailAction",
          label: "GuardrailAction"
        },
        {
          type: "doc",
          id: "api/enumerations/RagMemoryCategory",
          label: "RagMemoryCategory"
        },
        {
          type: "doc",
          id: "api/enumerations/ReasoningEntryType",
          label: "ReasoningEntryType"
        },
        {
          type: "doc",
          id: "api/enumerations/WorkflowStatus",
          label: "WorkflowStatus"
        },
        {
          type: "doc",
          id: "api/enumerations/WorkflowTaskStatus",
          label: "WorkflowTaskStatus"
        },
        {
          type: "doc",
          id: "api/classes/ActionDeduplicator",
          label: "ActionDeduplicator"
        },
        {
          type: "doc",
          id: "api/classes/AdaptiveVAD",
          label: "AdaptiveVAD"
        },
        {
          type: "doc",
          id: "api/classes/AdaptPersonalityTool",
          label: "AdaptPersonalityTool"
        },
        {
          type: "doc",
          id: "api/classes/AgencyMemoryManager",
          label: "AgencyMemoryManager"
        },
        {
          type: "doc",
          id: "api/classes/AgencyRegistry",
          label: "AgencyRegistry"
        },
        {
          type: "doc",
          id: "api/classes/AgentCommunicationBus",
          label: "AgentCommunicationBus"
        },
        {
          type: "doc",
          id: "api/classes/AgentGraph",
          label: "AgentGraph"
        },
        {
          type: "doc",
          id: "api/classes/AgentKeyManager",
          label: "AgentKeyManager"
        },
        {
          type: "doc",
          id: "api/classes/AgentMemory",
          label: "AgentMemory"
        },
        {
          type: "doc",
          id: "api/classes/AgentOSOrchestrator",
          label: "AgentOSOrchestrator"
        },
        {
          type: "doc",
          id: "api/classes/AgentOSServiceError",
          label: "AgentOSServiceError"
        },
        {
          type: "doc",
          id: "api/classes/AgentOSTurnPlanner",
          label: "AgentOSTurnPlanner"
        },
        {
          type: "doc",
          id: "api/classes/AIModelProviderManager",
          label: "AIModelProviderManager"
        },
        {
          type: "doc",
          id: "api/classes/AnchorManager",
          label: "AnchorManager"
        },
        {
          type: "doc",
          id: "api/classes/AssemblyAISTTProvider",
          label: "AssemblyAISTTProvider"
        },
        {
          type: "doc",
          id: "api/classes/AudioProcessor",
          label: "AudioProcessor"
        },
        {
          type: "doc",
          id: "api/classes/AutonomyGuard",
          label: "AutonomyGuard"
        },
        {
          type: "doc",
          id: "api/classes/AzureSpeechSTTProvider",
          label: "AzureSpeechSTTProvider"
        },
        {
          type: "doc",
          id: "api/classes/AzureSpeechTTSProvider",
          label: "AzureSpeechTTSProvider"
        },
        {
          type: "doc",
          id: "api/classes/BaseChannelAdapter",
          label: "BaseChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/BM25Index",
          label: "BM25Index"
        },
        {
          type: "doc",
          id: "api/classes/Brain",
          label: "Brain"
        },
        {
          type: "doc",
          id: "api/classes/BuiltInAdaptiveVadProvider",
          label: "BuiltInAdaptiveVadProvider"
        },
        {
          type: "doc",
          id: "api/classes/BundleExporter",
          label: "BundleExporter"
        },
        {
          type: "doc",
          id: "api/classes/CallManager",
          label: "CallManager"
        },
        {
          type: "doc",
          id: "api/classes/ChainVerifier",
          label: "ChainVerifier"
        },
        {
          type: "doc",
          id: "api/classes/ChannelRouter",
          label: "ChannelRouter"
        },
        {
          type: "doc",
          id: "api/classes/ChatGptImporter",
          label: "ChatGptImporter"
        },
        {
          type: "doc",
          id: "api/classes/ChunkingEngine",
          label: "ChunkingEngine"
        },
        {
          type: "doc",
          id: "api/classes/CircuitBreaker",
          label: "CircuitBreaker"
        },
        {
          type: "doc",
          id: "api/classes/CircuitOpenError",
          label: "CircuitOpenError"
        },
        {
          type: "doc",
          id: "api/classes/CitationVerifier",
          label: "CitationVerifier"
        },
        {
          type: "doc",
          id: "api/classes/CodeSandbox",
          label: "CodeSandbox"
        },
        {
          type: "doc",
          id: "api/classes/CognitiveMechanismsEngine",
          label: "CognitiveMechanismsEngine"
        },
        {
          type: "doc",
          id: "api/classes/CognitiveMemoryManager",
          label: "CognitiveMemoryManager"
        },
        {
          type: "doc",
          id: "api/classes/CognitiveWorkingMemory",
          label: "CognitiveWorkingMemory"
        },
        {
          type: "doc",
          id: "api/classes/CompactionEngine",
          label: "CompactionEngine"
        },
        {
          type: "doc",
          id: "api/classes/CompactionLog",
          label: "CompactionLog"
        },
        {
          type: "doc",
          id: "api/classes/CompiledAgentGraph",
          label: "CompiledAgentGraph"
        },
        {
          type: "doc",
          id: "api/classes/CompiledMission",
          label: "CompiledMission"
        },
        {
          type: "doc",
          id: "api/classes/CompiledWorkflow",
          label: "CompiledWorkflow"
        },
        {
          type: "doc",
          id: "api/classes/ComposableToolBuilder",
          label: "ComposableToolBuilder"
        },
        {
          type: "doc",
          id: "api/classes/CompositeAnchorProvider",
          label: "CompositeAnchorProvider"
        },
        {
          type: "doc",
          id: "api/classes/ConsoleSpanExporter",
          label: "ConsoleSpanExporter"
        },
        {
          type: "doc",
          id: "api/classes/ConsolidationLoop",
          label: "ConsolidationLoop"
        },
        {
          type: "doc",
          id: "api/classes/ConsolidationPipeline",
          label: "ConsolidationPipeline"
        },
        {
          type: "doc",
          id: "api/classes/ContextWindowManager",
          label: "ContextWindowManager"
        },
        {
          type: "doc",
          id: "api/classes/ConversationManager",
          label: "ConversationManager"
        },
        {
          type: "doc",
          id: "api/classes/ConversationVerifier",
          label: "ConversationVerifier"
        },
        {
          type: "doc",
          id: "api/classes/CostCapExceededError",
          label: "CostCapExceededError"
        },
        {
          type: "doc",
          id: "api/classes/CostGuard",
          label: "CostGuard"
        },
        {
          type: "doc",
          id: "api/classes/CreateWorkflowTool",
          label: "CreateWorkflowTool"
        },
        {
          type: "doc",
          id: "api/classes/CsvImporter",
          label: "CsvImporter"
        },
        {
          type: "doc",
          id: "api/classes/DeepgramBatchSTTProvider",
          label: "DeepgramBatchSTTProvider"
        },
        {
          type: "doc",
          id: "api/classes/DiscordChannelAdapter",
          label: "DiscordChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/DockerDetector",
          label: "DockerDetector"
        },
        {
          type: "doc",
          id: "api/classes/DocxLoader",
          label: "DocxLoader"
        },
        {
          type: "doc",
          id: "api/classes/ElevenLabsTextToSpeechProvider",
          label: "ElevenLabsTextToSpeechProvider"
        },
        {
          type: "doc",
          id: "api/classes/EmbeddingManager",
          label: "EmbeddingManager"
        },
        {
          type: "doc",
          id: "api/classes/EmergentAgentForge",
          label: "EmergentAgentForge"
        },
        {
          type: "doc",
          id: "api/classes/EmergentAgentJudge",
          label: "EmergentAgentJudge"
        },
        {
          type: "doc",
          id: "api/classes/EmergentCapabilityEngine",
          label: "EmergentCapabilityEngine"
        },
        {
          type: "doc",
          id: "api/classes/EmergentJudge",
          label: "EmergentJudge"
        },
        {
          type: "doc",
          id: "api/classes/EmergentToolRegistry",
          label: "EmergentToolRegistry"
        },
        {
          type: "doc",
          id: "api/classes/EnvironmentalCalibrator",
          label: "EnvironmentalCalibrator"
        },
        {
          type: "doc",
          id: "api/classes/Evaluator",
          label: "Evaluator"
        },
        {
          type: "doc",
          id: "api/classes/ExtensionLoader",
          label: "ExtensionLoader"
        },
        {
          type: "doc",
          id: "api/classes/ExtensionManager",
          label: "ExtensionManager"
        },
        {
          type: "doc",
          id: "api/classes/ExtensionRegistry",
          label: "ExtensionRegistry"
        },
        {
          type: "doc",
          id: "api/classes/FactExtractor",
          label: "FactExtractor"
        },
        {
          type: "doc",
          id: "api/classes/FactStore",
          label: "FactStore"
        },
        {
          type: "doc",
          id: "api/classes/FactSupersession",
          label: "FactSupersession"
        },
        {
          type: "doc",
          id: "api/classes/FalImageProvider",
          label: "FalImageProvider"
        },
        {
          type: "doc",
          id: "api/classes/FallbackAudioProxy",
          label: "FallbackAudioProxy"
        },
        {
          type: "doc",
          id: "api/classes/FallbackImageProxy",
          label: "FallbackImageProxy"
        },
        {
          type: "doc",
          id: "api/classes/FallbackSTTProxy",
          label: "FallbackSTTProxy"
        },
        {
          type: "doc",
          id: "api/classes/FallbackTTSProxy",
          label: "FallbackTTSProxy"
        },
        {
          type: "doc",
          id: "api/classes/FallbackVideoProxy",
          label: "FallbackVideoProxy"
        },
        {
          type: "doc",
          id: "api/classes/FluxImageProvider",
          label: "FluxImageProvider"
        },
        {
          type: "doc",
          id: "api/classes/FolderScanner",
          label: "FolderScanner"
        },
        {
          type: "doc",
          id: "api/classes/ForgeStatsAggregator",
          label: "ForgeStatsAggregator"
        },
        {
          type: "doc",
          id: "api/classes/ForgeToolMetaTool",
          label: "ForgeToolMetaTool"
        },
        {
          type: "doc",
          id: "api/classes/GMIManager",
          label: "GMIManager"
        },
        {
          type: "doc",
          id: "api/classes/GMIManagerError",
          label: "GMIManagerError"
        },
        {
          type: "doc",
          id: "api/classes/GoogleChatChannelAdapter",
          label: "GoogleChatChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/GraphCompiler",
          label: "GraphCompiler"
        },
        {
          type: "doc",
          id: "api/classes/GraphEventEmitter",
          label: "GraphEventEmitter"
        },
        {
          type: "doc",
          id: "api/classes/GraphExpander",
          label: "GraphExpander"
        },
        {
          type: "doc",
          id: "api/classes/GraphologyMemoryGraph",
          label: "GraphologyMemoryGraph"
        },
        {
          type: "doc",
          id: "api/classes/GraphRAGEngine",
          label: "GraphRAGEngine"
        },
        {
          type: "doc",
          id: "api/classes/GraphRuntime",
          label: "GraphRuntime"
        },
        {
          type: "doc",
          id: "api/classes/GraphValidator",
          label: "GraphValidator"
        },
        {
          type: "doc",
          id: "api/classes/HashChain",
          label: "HashChain"
        },
        {
          type: "doc",
          id: "api/classes/HierarchicalStrategy",
          label: "HierarchicalStrategy"
        },
        {
          type: "doc",
          id: "api/classes/HnswlibVectorStore",
          label: "HnswlibVectorStore"
        },
        {
          type: "doc",
          id: "api/classes/HnswSidecar",
          label: "HnswSidecar"
        },
        {
          type: "doc",
          id: "api/classes/HtmlLoader",
          label: "HtmlLoader"
        },
        {
          type: "doc",
          id: "api/classes/HumanInteractionManager",
          label: "HumanInteractionManager"
        },
        {
          type: "doc",
          id: "api/classes/HybridFeatureDetector",
          label: "HybridFeatureDetector"
        },
        {
          type: "doc",
          id: "api/classes/HybridRetriever",
          label: "HybridRetriever"
        },
        {
          type: "doc",
          id: "api/classes/HybridSearcher",
          label: "HybridSearcher"
        },
        {
          type: "doc",
          id: "api/classes/HybridStrategy",
          label: "HybridStrategy"
        },
        {
          type: "doc",
          id: "api/classes/HybridUtilityAI",
          label: "HybridUtilityAI"
        },
        {
          type: "doc",
          id: "api/classes/HydeRetriever",
          label: "HydeRetriever"
        },
        {
          type: "doc",
          id: "api/classes/ImageEditNotSupportedError",
          label: "ImageEditNotSupportedError"
        },
        {
          type: "doc",
          id: "api/classes/ImageUpscaleNotSupportedError",
          label: "ImageUpscaleNotSupportedError"
        },
        {
          type: "doc",
          id: "api/classes/ImageVariationNotSupportedError",
          label: "ImageVariationNotSupportedError"
        },
        {
          type: "doc",
          id: "api/classes/InMemoryCheckpointStore",
          label: "InMemoryCheckpointStore"
        },
        {
          type: "doc",
          id: "api/classes/InMemorySpanExporter",
          label: "InMemorySpanExporter"
        },
        {
          type: "doc",
          id: "api/classes/InMemoryStorageAdapter",
          label: "InMemoryStorageAdapter"
        },
        {
          type: "doc",
          id: "api/classes/InMemoryVectorStore",
          label: "InMemoryVectorStore"
        },
        {
          type: "doc",
          id: "api/classes/InMemoryWorkflowStore",
          label: "InMemoryWorkflowStore"
        },
        {
          type: "doc",
          id: "api/classes/IRCChannelAdapter",
          label: "IRCChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/JsonExporter",
          label: "JsonExporter"
        },
        {
          type: "doc",
          id: "api/classes/JsonImporter",
          label: "JsonImporter"
        },
        {
          type: "doc",
          id: "api/classes/KeywordFallback",
          label: "KeywordFallback"
        },
        {
          type: "doc",
          id: "api/classes/KeywordFeatureDetector",
          label: "KeywordFeatureDetector"
        },
        {
          type: "doc",
          id: "api/classes/KnowledgeGraph",
          label: "KnowledgeGraph"
        },
        {
          type: "doc",
          id: "api/classes/KnowledgeGraphMemoryGraph",
          label: "KnowledgeGraphMemoryGraph"
        },
        {
          type: "doc",
          id: "api/classes/LanguageService",
          label: "LanguageService"
        },
        {
          type: "doc",
          id: "api/classes/LlmFeatureDetector",
          label: "LlmFeatureDetector"
        },
        {
          type: "doc",
          id: "api/classes/LLMJudge",
          label: "LLMJudge"
        },
        {
          type: "doc",
          id: "api/classes/LLMUtilityAI",
          label: "LLMUtilityAI"
        },
        {
          type: "doc",
          id: "api/classes/LLMVisionProvider",
          label: "LLMVisionProvider"
        },
        {
          type: "doc",
          id: "api/classes/LoaderRegistry",
          label: "LoaderRegistry"
        },
        {
          type: "doc",
          id: "api/classes/LoopController",
          label: "LoopController"
        },
        {
          type: "doc",
          id: "api/classes/ManageGraphTool",
          label: "ManageGraphTool"
        },
        {
          type: "doc",
          id: "api/classes/ManageSkillsTool",
          label: "ManageSkillsTool"
        },
        {
          type: "doc",
          id: "api/classes/MarkdownExporter",
          label: "MarkdownExporter"
        },
        {
          type: "doc",
          id: "api/classes/MarkdownImporter",
          label: "MarkdownImporter"
        },
        {
          type: "doc",
          id: "api/classes/MarkdownLoader",
          label: "MarkdownLoader"
        },
        {
          type: "doc",
          id: "api/classes/MarkdownWorkingMemory",
          label: "MarkdownWorkingMemory"
        },
        {
          type: "doc",
          id: "api/classes/Marketplace",
          label: "Marketplace"
        },
        {
          type: "doc",
          id: "api/classes/Memory",
          label: "Memory"
        },
        {
          type: "doc",
          id: "api/classes/MemoryAddTool",
          label: "MemoryAddTool"
        },
        {
          type: "doc",
          id: "api/classes/MemoryDeleteTool",
          label: "MemoryDeleteTool"
        },
        {
          type: "doc",
          id: "api/classes/MemoryMergeTool",
          label: "MemoryMergeTool"
        },
        {
          type: "doc",
          id: "api/classes/MemoryObserver",
          label: "MemoryObserver"
        },
        {
          type: "doc",
          id: "api/classes/MemoryReflector",
          label: "MemoryReflector"
        },
        {
          type: "doc",
          id: "api/classes/MemoryReflectTool",
          label: "MemoryReflectTool"
        },
        {
          type: "doc",
          id: "api/classes/MemorySearchTool",
          label: "MemorySearchTool"
        },
        {
          type: "doc",
          id: "api/classes/MemoryStore",
          label: "MemoryStore"
        },
        {
          type: "doc",
          id: "api/classes/MemoryUpdateTool",
          label: "MemoryUpdateTool"
        },
        {
          type: "doc",
          id: "api/classes/MerkleTree",
          label: "MerkleTree"
        },
        {
          type: "doc",
          id: "api/classes/MigrationEngine",
          label: "MigrationEngine"
        },
        {
          type: "doc",
          id: "api/classes/MissionBuilder",
          label: "MissionBuilder"
        },
        {
          type: "doc",
          id: "api/classes/MissionCompiler",
          label: "MissionCompiler"
        },
        {
          type: "doc",
          id: "api/classes/MissionPlanner",
          label: "MissionPlanner"
        },
        {
          type: "doc",
          id: "api/classes/ModelRouter",
          label: "ModelRouter"
        },
        {
          type: "doc",
          id: "api/classes/MultimodalAggregator",
          label: "MultimodalAggregator"
        },
        {
          type: "doc",
          id: "api/classes/MultimodalIndexer",
          label: "MultimodalIndexer"
        },
        {
          type: "doc",
          id: "api/classes/MultiRegistryLoader",
          label: "MultiRegistryLoader"
        },
        {
          type: "doc",
          id: "api/classes/Neo4jConnectionManager",
          label: "Neo4jConnectionManager"
        },
        {
          type: "doc",
          id: "api/classes/Neo4jCypherRunner",
          label: "Neo4jCypherRunner"
        },
        {
          type: "doc",
          id: "api/classes/Neo4jGraphRAGEngine",
          label: "Neo4jGraphRAGEngine"
        },
        {
          type: "doc",
          id: "api/classes/Neo4jKnowledgeGraph",
          label: "Neo4jKnowledgeGraph"
        },
        {
          type: "doc",
          id: "api/classes/NodeExecutor",
          label: "NodeExecutor"
        },
        {
          type: "doc",
          id: "api/classes/NodeScheduler",
          label: "NodeScheduler"
        },
        {
          type: "doc",
          id: "api/classes/NoneProvider",
          label: "NoneProvider"
        },
        {
          type: "doc",
          id: "api/classes/ObjectGenerationError",
          label: "ObjectGenerationError"
        },
        {
          type: "doc",
          id: "api/classes/ObservationBuffer",
          label: "ObservationBuffer"
        },
        {
          type: "doc",
          id: "api/classes/ObservationCompressor",
          label: "ObservationCompressor"
        },
        {
          type: "doc",
          id: "api/classes/ObservationReflector",
          label: "ObservationReflector"
        },
        {
          type: "doc",
          id: "api/classes/ObsidianExporter",
          label: "ObsidianExporter"
        },
        {
          type: "doc",
          id: "api/classes/ObsidianImporter",
          label: "ObsidianImporter"
        },
        {
          type: "doc",
          id: "api/classes/OpenAIImageProvider",
          label: "OpenAIImageProvider"
        },
        {
          type: "doc",
          id: "api/classes/OpenAITextToSpeechProvider",
          label: "OpenAITextToSpeechProvider"
        },
        {
          type: "doc",
          id: "api/classes/OpenAIWhisperSpeechToTextProvider",
          label: "OpenAIWhisperSpeechToTextProvider"
        },
        {
          type: "doc",
          id: "api/classes/OpenRouterImageProvider",
          label: "OpenRouterImageProvider"
        },
        {
          type: "doc",
          id: "api/classes/ParallelGuardrailDispatcher",
          label: "ParallelGuardrailDispatcher"
        },
        {
          type: "doc",
          id: "api/classes/PdfLoader",
          label: "PdfLoader"
        },
        {
          type: "doc",
          id: "api/classes/PersonalityMutationStore",
          label: "PersonalityMutationStore"
        },
        {
          type: "doc",
          id: "api/classes/PersonaOverlayManager",
          label: "PersonaOverlayManager"
        },
        {
          type: "doc",
          id: "api/classes/PineconeVectorStore",
          label: "PineconeVectorStore"
        },
        {
          type: "doc",
          id: "api/classes/PipelineVisionProvider",
          label: "PipelineVisionProvider"
        },
        {
          type: "doc",
          id: "api/classes/PlanningEngine",
          label: "PlanningEngine"
        },
        {
          type: "doc",
          id: "api/classes/PlivoMediaStreamParser",
          label: "PlivoMediaStreamParser"
        },
        {
          type: "doc",
          id: "api/classes/PlivoVoiceProvider",
          label: "PlivoVoiceProvider"
        },
        {
          type: "doc",
          id: "api/classes/PolicyAwareImageRouter",
          label: "PolicyAwareImageRouter"
        },
        {
          type: "doc",
          id: "api/classes/PostgresSetup",
          label: "PostgresSetup"
        },
        {
          type: "doc",
          id: "api/classes/PostgresVectorStore",
          label: "PostgresVectorStore"
        },
        {
          type: "doc",
          id: "api/classes/PromptEngineError",
          label: "PromptEngineError"
        },
        {
          type: "doc",
          id: "api/classes/ProspectiveMemoryManager",
          label: "ProspectiveMemoryManager"
        },
        {
          type: "doc",
          id: "api/classes/ProvenanceViolationError",
          label: "ProvenanceViolationError"
        },
        {
          type: "doc",
          id: "api/classes/ProviderAssignmentEngine",
          label: "ProviderAssignmentEngine"
        },
        {
          type: "doc",
          id: "api/classes/QdrantSetup",
          label: "QdrantSetup"
        },
        {
          type: "doc",
          id: "api/classes/QdrantVectorStore",
          label: "QdrantVectorStore"
        },
        {
          type: "doc",
          id: "api/classes/QueryClassifier",
          label: "QueryClassifier"
        },
        {
          type: "doc",
          id: "api/classes/QueryDispatcher",
          label: "QueryDispatcher"
        },
        {
          type: "doc",
          id: "api/classes/QueryGenerator",
          label: "QueryGenerator"
        },
        {
          type: "doc",
          id: "api/classes/QueryRouter",
          label: "QueryRouter"
        },
        {
          type: "doc",
          id: "api/classes/RAGAuditCollector",
          label: "RAGAuditCollector"
        },
        {
          type: "doc",
          id: "api/classes/RAGOperationHandle",
          label: "RAGOperationHandle"
        },
        {
          type: "doc",
          id: "api/classes/RaptorTree",
          label: "RaptorTree"
        },
        {
          type: "doc",
          id: "api/classes/ReadWorkingMemoryTool",
          label: "ReadWorkingMemoryTool"
        },
        {
          type: "doc",
          id: "api/classes/RedditChannelAdapter",
          label: "RedditChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/ReplicateFaceEmbeddingService",
          label: "ReplicateFaceEmbeddingService"
        },
        {
          type: "doc",
          id: "api/classes/ReplicateImageProvider",
          label: "ReplicateImageProvider"
        },
        {
          type: "doc",
          id: "api/classes/RequestExpansionTool",
          label: "RequestExpansionTool"
        },
        {
          type: "doc",
          id: "api/classes/RetrievalAugmentor",
          label: "RetrievalAugmentor"
        },
        {
          type: "doc",
          id: "api/classes/RetrievalFeedbackSignal",
          label: "RetrievalFeedbackSignal"
        },
        {
          type: "doc",
          id: "api/classes/RevisionManager",
          label: "RevisionManager"
        },
        {
          type: "doc",
          id: "api/classes/RollingSummaryChain",
          label: "RollingSummaryChain"
        },
        {
          type: "doc",
          id: "api/classes/SandboxedToolForge",
          label: "SandboxedToolForge"
        },
        {
          type: "doc",
          id: "api/classes/SandboxError",
          label: "SandboxError"
        },
        {
          type: "doc",
          id: "api/classes/SelfEvaluateTool",
          label: "SelfEvaluateTool"
        },
        {
          type: "doc",
          id: "api/classes/SemanticChunker",
          label: "SemanticChunker"
        },
        {
          type: "doc",
          id: "api/classes/SentenceBoundaryBuffer",
          label: "SentenceBoundaryBuffer"
        },
        {
          type: "doc",
          id: "api/classes/SessionRetriever",
          label: "SessionRetriever"
        },
        {
          type: "doc",
          id: "api/classes/SessionSummarizer",
          label: "SessionSummarizer"
        },
        {
          type: "doc",
          id: "api/classes/SessionSummaryStore",
          label: "SessionSummaryStore"
        },
        {
          type: "doc",
          id: "api/classes/SharedServiceRegistry",
          label: "SharedServiceRegistry"
        },
        {
          type: "doc",
          id: "api/classes/SignalChannelAdapter",
          label: "SignalChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/SignedEventLedger",
          label: "SignedEventLedger"
        },
        {
          type: "doc",
          id: "api/classes/SilenceDetector",
          label: "SilenceDetector"
        },
        {
          type: "doc",
          id: "api/classes/SkillRegistry",
          label: "SkillRegistry"
        },
        {
          type: "doc",
          id: "api/classes/SlackChannelAdapter",
          label: "SlackChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/SlidingSummaryStrategy",
          label: "SlidingSummaryStrategy"
        },
        {
          type: "doc",
          id: "api/classes/SpeechProviderAdapter",
          label: "SpeechProviderAdapter"
        },
        {
          type: "doc",
          id: "api/classes/SpeechProviderRegistry",
          label: "SpeechProviderRegistry"
        },
        {
          type: "doc",
          id: "api/classes/SpeechProviderResolver",
          label: "SpeechProviderResolver"
        },
        {
          type: "doc",
          id: "api/classes/SpeechRuntime",
          label: "SpeechRuntime"
        },
        {
          type: "doc",
          id: "api/classes/SpeechSession",
          label: "SpeechSession"
        },
        {
          type: "doc",
          id: "api/classes/SqlKnowledgeGraph",
          label: "SqlKnowledgeGraph"
        },
        {
          type: "doc",
          id: "api/classes/SqlMemoryGraph",
          label: "SqlMemoryGraph"
        },
        {
          type: "doc",
          id: "api/classes/SqlStorageAdapter",
          label: "SqlStorageAdapter"
        },
        {
          type: "doc",
          id: "api/classes/SqlTaskOutcomeTelemetryStore",
          label: "SqlTaskOutcomeTelemetryStore"
        },
        {
          type: "doc",
          id: "api/classes/SqlVectorStore",
          label: "SqlVectorStore"
        },
        {
          type: "doc",
          id: "api/classes/StabilityImageProvider",
          label: "StabilityImageProvider"
        },
        {
          type: "doc",
          id: "api/classes/StableDiffusionLocalProvider",
          label: "StableDiffusionLocalProvider"
        },
        {
          type: "doc",
          id: "api/classes/StateManager",
          label: "StateManager"
        },
        {
          type: "doc",
          id: "api/classes/StatisticalUtilityAI",
          label: "StatisticalUtilityAI"
        },
        {
          type: "doc",
          id: "api/classes/StreamError",
          label: "StreamError"
        },
        {
          type: "doc",
          id: "api/classes/StreamingManager",
          label: "StreamingManager"
        },
        {
          type: "doc",
          id: "api/classes/StructuredOutputError",
          label: "StructuredOutputError"
        },
        {
          type: "doc",
          id: "api/classes/StructuredOutputManager",
          label: "StructuredOutputManager"
        },
        {
          type: "doc",
          id: "api/classes/StuckDetector",
          label: "StuckDetector"
        },
        {
          type: "doc",
          id: "api/classes/TeamsChannelAdapter",
          label: "TeamsChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/TelegramChannelAdapter",
          label: "TelegramChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/TelephonyStreamTransport",
          label: "TelephonyStreamTransport"
        },
        {
          type: "doc",
          id: "api/classes/TelnyxMediaStreamParser",
          label: "TelnyxMediaStreamParser"
        },
        {
          type: "doc",
          id: "api/classes/TelnyxVoiceProvider",
          label: "TelnyxVoiceProvider"
        },
        {
          type: "doc",
          id: "api/classes/TextLoader",
          label: "TextLoader"
        },
        {
          type: "doc",
          id: "api/classes/TombstoneManager",
          label: "TombstoneManager"
        },
        {
          type: "doc",
          id: "api/classes/ToolExecutionGuard",
          label: "ToolExecutionGuard"
        },
        {
          type: "doc",
          id: "api/classes/ToolTimeoutError",
          label: "ToolTimeoutError"
        },
        {
          type: "doc",
          id: "api/classes/TopicExtractor",
          label: "TopicExtractor"
        },
        {
          type: "doc",
          id: "api/classes/Tracer",
          label: "Tracer"
        },
        {
          type: "doc",
          id: "api/classes/TwilioMediaStreamParser",
          label: "TwilioMediaStreamParser"
        },
        {
          type: "doc",
          id: "api/classes/TwilioVoiceProvider",
          label: "TwilioVoiceProvider"
        },
        {
          type: "doc",
          id: "api/classes/TwitterChannelAdapter",
          label: "TwitterChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/TypedNetworkObserver",
          label: "TypedNetworkObserver"
        },
        {
          type: "doc",
          id: "api/classes/TypedNetworkRetriever",
          label: "TypedNetworkRetriever"
        },
        {
          type: "doc",
          id: "api/classes/TypedNetworkStore",
          label: "TypedNetworkStore"
        },
        {
          type: "doc",
          id: "api/classes/TypedSpreadingActivation",
          label: "TypedSpreadingActivation"
        },
        {
          type: "doc",
          id: "api/classes/UnifiedRetriever",
          label: "UnifiedRetriever"
        },
        {
          type: "doc",
          id: "api/classes/UpdateWorkingMemoryTool",
          label: "UpdateWorkingMemoryTool"
        },
        {
          type: "doc",
          id: "api/classes/UrlLoader",
          label: "UrlLoader"
        },
        {
          type: "doc",
          id: "api/classes/UsageLedger",
          label: "UsageLedger"
        },
        {
          type: "doc",
          id: "api/classes/VectorStoreManager",
          label: "VectorStoreManager"
        },
        {
          type: "doc",
          id: "api/classes/VideoAnalyzer",
          label: "VideoAnalyzer"
        },
        {
          type: "doc",
          id: "api/classes/VisionPipeline",
          label: "VisionPipeline"
        },
        {
          type: "doc",
          id: "api/classes/VoiceNodeBuilder",
          label: "VoiceNodeBuilder"
        },
        {
          type: "doc",
          id: "api/classes/WebChatChannelAdapter",
          label: "WebChatChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/WhatsAppChannelAdapter",
          label: "WhatsAppChannelAdapter"
        },
        {
          type: "doc",
          id: "api/classes/WorkflowBuilder",
          label: "WorkflowBuilder"
        },
        {
          type: "doc",
          id: "api/classes/WorkflowEngine",
          label: "WorkflowEngine"
        },
        {
          type: "doc",
          id: "api/interfaces/ActionDeduplicatorConfig",
          label: "ActionDeduplicatorConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ActivatedNode",
          label: "ActivatedNode"
        },
        {
          type: "doc",
          id: "api/interfaces/ActiveExtensionDescriptor",
          label: "ActiveExtensionDescriptor"
        },
        {
          type: "doc",
          id: "api/interfaces/AdaptiveVADConfig",
          label: "AdaptiveVADConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyCallbacks",
          label: "AgencyCallbacks"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyConfigErrorType",
          label: "AgencyConfigErrorType"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyInvocationRequest",
          label: "AgencyInvocationRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryChunk",
          label: "AgencyMemoryChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryConfig",
          label: "AgencyMemoryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryIngestInput",
          label: "AgencyMemoryIngestInput"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryOperationResult",
          label: "AgencyMemoryOperationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryQueryOptions",
          label: "AgencyMemoryQueryOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryQueryResult",
          label: "AgencyMemoryQueryResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryRetentionPolicy",
          label: "AgencyMemoryRetentionPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryScopingConfig",
          label: "AgencyMemoryScopingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyMemoryStats",
          label: "AgencyMemoryStats"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyOptions",
          label: "AgencyOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencySeatHistoryEntry",
          label: "AgencySeatHistoryEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencySeatRegistrationArgs",
          label: "AgencySeatRegistrationArgs"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencySeatState",
          label: "AgencySeatState"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencySession",
          label: "AgencySession"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyStreamResult",
          label: "AgencyStreamResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AgencyUpsertArgs",
          label: "AgencyUpsertArgs"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentCallRecord",
          label: "AgentCallRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentExportConfig",
          label: "AgentExportConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentKeyRecord",
          label: "AgentKeyRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentKeySource",
          label: "AgentKeySource"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentMemoryProvider",
          label: "AgentMemoryProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentMessage",
          label: "AgentMessage"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOptions",
          label: "AgentOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOrchestratorConfig",
          label: "AgentOrchestratorConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSActiveConversationSnapshot",
          label: "AgentOSActiveConversationSnapshot"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSActiveGMISnapshot",
          label: "AgentOSActiveGMISnapshot"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSAdaptiveExecutionConfig",
          label: "AgentOSAdaptiveExecutionConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSAgencyUpdateChunk",
          label: "AgentOSAgencyUpdateChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSCapabilityDiscoverySources",
          label: "AgentOSCapabilityDiscoverySources"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSConfig",
          label: "AgentOSConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSErrorChunk",
          label: "AgentOSErrorChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSExternalToolHandlerContext",
          label: "AgentOSExternalToolHandlerContext"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSExternalToolHandlerResult",
          label: "AgentOSExternalToolHandlerResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSFinalResponseChunk",
          label: "AgentOSFinalResponseChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSInput",
          label: "AgentOSInput"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSLanguageConfig",
          label: "AgentOSLanguageConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSLongTermMemoryRecallConfig",
          label: "AgentOSLongTermMemoryRecallConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSMemoryControl",
          label: "AgentOSMemoryControl"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSMemoryToolsConfig",
          label: "AgentOSMemoryToolsConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSMetadataUpdateChunk",
          label: "AgentOSMetadataUpdateChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSObservabilityConfig",
          label: "AgentOSObservabilityConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSOrchestratorConfig",
          label: "AgentOSOrchestratorConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSOrchestratorDependencies",
          label: "AgentOSOrchestratorDependencies"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSPendingExternalToolRequest",
          label: "AgentOSPendingExternalToolRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSProvenanceEventChunk",
          label: "AgentOSProvenanceEventChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSResponseChunk",
          label: "AgentOSResponseChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSResumeExternalToolRequestOptions",
          label: "AgentOSResumeExternalToolRequestOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSRuntimeSnapshot",
          label: "AgentOSRuntimeSnapshot"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOsSqlStorageConfig",
          label: "AgentOsSqlStorageConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSStandaloneMemoryConfig",
          label: "AgentOSStandaloneMemoryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSSystemProgressChunk",
          label: "AgentOSSystemProgressChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSTaskOutcomeTelemetryConfig",
          label: "AgentOSTaskOutcomeTelemetryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSTenantRoutingConfig",
          label: "AgentOSTenantRoutingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSTextDeltaChunk",
          label: "AgentOSTextDeltaChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSToolCallRequestChunk",
          label: "AgentOSToolCallRequestChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSToolResultEmissionChunk",
          label: "AgentOSToolResultEmissionChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSToolResultInput",
          label: "AgentOSToolResultInput"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSTurnPlanningConfig",
          label: "AgentOSTurnPlanningConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSUICommandChunk",
          label: "AgentOSUICommandChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSUsageAggregate",
          label: "AgentOSUsageAggregate"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSUsageEvent",
          label: "AgentOSUsageEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSUsageLedgerOptions",
          label: "AgentOSUsageLedgerOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSUsageRecordInput",
          label: "AgentOSUsageRecordInput"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentOSWorkflowUpdateChunk",
          label: "AgentOSWorkflowUpdateChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentRequest",
          label: "AgentRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentResponse",
          label: "AgentResponse"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentSession",
          label: "AgentSession"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentSpec",
          label: "AgentSpec"
        },
        {
          type: "doc",
          id: "api/interfaces/AgentVerdict",
          label: "AgentVerdict"
        },
        {
          type: "doc",
          id: "api/interfaces/AggregateMetrics",
          label: "AggregateMetrics"
        },
        {
          type: "doc",
          id: "api/interfaces/AIModelProviderManagerConfig",
          label: "AIModelProviderManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AlternativeAction",
          label: "AlternativeAction"
        },
        {
          type: "doc",
          id: "api/interfaces/AnalyzeVideoOptions",
          label: "AnalyzeVideoOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AnalyzeVideoResult",
          label: "AnalyzeVideoResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AnchorProvider",
          label: "AnchorProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/AnchorProviderResult",
          label: "AnchorProviderResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AnchorRecord",
          label: "AnchorRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/AnchorTarget",
          label: "AnchorTarget"
        },
        {
          type: "doc",
          id: "api/interfaces/ApplyPersonaRulesArgs",
          label: "ApplyPersonaRulesArgs"
        },
        {
          type: "doc",
          id: "api/interfaces/ApprovalDecision",
          label: "ApprovalDecision"
        },
        {
          type: "doc",
          id: "api/interfaces/ApprovalRequest",
          label: "ApprovalRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/AssembledMemoryContext",
          label: "AssembledMemoryContext"
        },
        {
          type: "doc",
          id: "api/interfaces/AssemblyAISTTProviderConfig",
          label: "AssemblyAISTTProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioFallbackEvent",
          label: "AudioFallbackEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioIndexOptions",
          label: "AudioIndexOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioIndexResult",
          label: "AudioIndexResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioInputData",
          label: "AudioInputData"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioOutputConfig",
          label: "AudioOutputConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioProgressEvent",
          label: "AudioProgressEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioProviderUsage",
          label: "AudioProviderUsage"
        },
        {
          type: "doc",
          id: "api/interfaces/AudioResult",
          label: "AudioResult"
        },
        {
          type: "doc",
          id: "api/interfaces/AuditEntry",
          label: "AuditEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/AutonomousLoopOptions",
          label: "AutonomousLoopOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/AutonomyConfig",
          label: "AutonomyConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AzureSpeechSTTProviderConfig",
          label: "AzureSpeechSTTProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/AzureSpeechTTSProviderConfig",
          label: "AzureSpeechTTSProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/BackendConfig",
          label: "BackendConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/BackendStatus",
          label: "BackendStatus"
        },
        {
          type: "doc",
          id: "api/interfaces/BM25Config",
          label: "BM25Config"
        },
        {
          type: "doc",
          id: "api/interfaces/BM25Document",
          label: "BM25Document"
        },
        {
          type: "doc",
          id: "api/interfaces/BM25Result",
          label: "BM25Result"
        },
        {
          type: "doc",
          id: "api/interfaces/BM25Stats",
          label: "BM25Stats"
        },
        {
          type: "doc",
          id: "api/interfaces/BufferedMessage",
          label: "BufferedMessage"
        },
        {
          type: "doc",
          id: "api/interfaces/BuildEmergentToolPackageOptions",
          label: "BuildEmergentToolPackageOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/BuildLlmCallerOptions",
          label: "BuildLlmCallerOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/BuiltInAdaptiveVadProviderConfig",
          label: "BuiltInAdaptiveVadProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ButtonCallbackData",
          label: "ButtonCallbackData"
        },
        {
          type: "doc",
          id: "api/interfaces/CalibrationConfig",
          label: "CalibrationConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/CallManagerEvent",
          label: "CallManagerEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/CallRecord",
          label: "CallRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/CandidateBranch",
          label: "CandidateBranch"
        },
        {
          type: "doc",
          id: "api/interfaces/CandidateTrace",
          label: "CandidateTrace"
        },
        {
          type: "doc",
          id: "api/interfaces/CapturedForge",
          label: "CapturedForge"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelAuthConfig",
          label: "ChannelAuthConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelBindingConfig",
          label: "ChannelBindingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelConnectionInfo",
          label: "ChannelConnectionInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelEvent",
          label: "ChannelEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelInfo",
          label: "ChannelInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelMessage",
          label: "ChannelMessage"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelSendResult",
          label: "ChannelSendResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ChannelSession",
          label: "ChannelSession"
        },
        {
          type: "doc",
          id: "api/interfaces/Checkpoint",
          label: "Checkpoint"
        },
        {
          type: "doc",
          id: "api/interfaces/CheckpointDecision",
          label: "CheckpointDecision"
        },
        {
          type: "doc",
          id: "api/interfaces/CheckpointMetadata",
          label: "CheckpointMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/CircuitBreakerConfig",
          label: "CircuitBreakerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/CircuitBreakerStats",
          label: "CircuitBreakerStats"
        },
        {
          type: "doc",
          id: "api/interfaces/CitationVerifierConfig",
          label: "CitationVerifierConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ClaimVerdict",
          label: "ClaimVerdict"
        },
        {
          type: "doc",
          id: "api/interfaces/ClarificationOption",
          label: "ClarificationOption"
        },
        {
          type: "doc",
          id: "api/interfaces/ClarificationRequest",
          label: "ClarificationRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ClarificationResponse",
          label: "ClarificationResponse"
        },
        {
          type: "doc",
          id: "api/interfaces/ClassificationOptions",
          label: "ClassificationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ClassificationResult",
          label: "ClassificationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ClassificationScore",
          label: "ClassificationScore"
        },
        {
          type: "doc",
          id: "api/interfaces/ClassifyCompleteEvent",
          label: "ClassifyCompleteEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ClassifyErrorEvent",
          label: "ClassifyErrorEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ClassifyStartEvent",
          label: "ClassifyStartEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/CognitiveMechanismsConfig",
          label: "CognitiveMechanismsConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/CognitiveMemoryConfig",
          label: "CognitiveMemoryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/CognitiveMemoryPersonaConfig",
          label: "CognitiveMemoryPersonaConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/CognitiveRetrievalOptions",
          label: "CognitiveRetrievalOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/CognitiveRetrievalResult",
          label: "CognitiveRetrievalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/CognitiveWorkingMemoryConfig",
          label: "CognitiveWorkingMemoryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/CommunicationChannelPayload",
          label: "CommunicationChannelPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/CompactionEntry",
          label: "CompactionEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/CompactionInput",
          label: "CompactionInput"
        },
        {
          type: "doc",
          id: "api/interfaces/CompactionLogStats",
          label: "CompactionLogStats"
        },
        {
          type: "doc",
          id: "api/interfaces/CompactionResult",
          label: "CompactionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/CompiledExecutionGraph",
          label: "CompiledExecutionGraph"
        },
        {
          type: "doc",
          id: "api/interfaces/CompiledStrategy",
          label: "CompiledStrategy"
        },
        {
          type: "doc",
          id: "api/interfaces/CompiledStrategyStreamResult",
          label: "CompiledStrategyStreamResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ComposableStep",
          label: "ComposableStep"
        },
        {
          type: "doc",
          id: "api/interfaces/ComposableToolSpec",
          label: "ComposableToolSpec"
        },
        {
          type: "doc",
          id: "api/interfaces/CompressedObservation",
          label: "CompressedObservation"
        },
        {
          type: "doc",
          id: "api/interfaces/ConsolidationConfig",
          label: "ConsolidationConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ConsolidationPipelineConfig",
          label: "ConsolidationPipelineConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ConsolidationResult",
          label: "ConsolidationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ContentFeatures",
          label: "ContentFeatures"
        },
        {
          type: "doc",
          id: "api/interfaces/ContextMessage",
          label: "ContextMessage"
        },
        {
          type: "doc",
          id: "api/interfaces/ContextualPromptElement",
          label: "ContextualPromptElement"
        },
        {
          type: "doc",
          id: "api/interfaces/ContextualPromptElementCriteria",
          label: "ContextualPromptElementCriteria"
        },
        {
          type: "doc",
          id: "api/interfaces/ContextWindowManagerConfig",
          label: "ContextWindowManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ContextWindowStats",
          label: "ContextWindowStats"
        },
        {
          type: "doc",
          id: "api/interfaces/ConversationManagerConfig",
          label: "ConversationManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ConversationMessage",
          label: "ConversationMessage"
        },
        {
          type: "doc",
          id: "api/interfaces/ConversationVerificationResult",
          label: "ConversationVerificationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/CorpusChunk",
          label: "CorpusChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/CostAggregator",
          label: "CostAggregator"
        },
        {
          type: "doc",
          id: "api/interfaces/CostGuardConfig",
          label: "CostGuardConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/CostRecord",
          label: "CostRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/CostSnapshot",
          label: "CostSnapshot"
        },
        {
          type: "doc",
          id: "api/interfaces/CreateCollectionOptions",
          label: "CreateCollectionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/CreateMissionExpansionHandlerOptions",
          label: "CreateMissionExpansionHandlerOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/CreationVerdict",
          label: "CreationVerdict"
        },
        {
          type: "doc",
          id: "api/interfaces/CrossAgentEvaluationResult",
          label: "CrossAgentEvaluationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/CrossAgentGuardrailContext",
          label: "CrossAgentGuardrailContext"
        },
        {
          type: "doc",
          id: "api/interfaces/CrossAgentOutputPayload",
          label: "CrossAgentOutputPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/DecayConfig",
          label: "DecayConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/DecayResult",
          label: "DecayResult"
        },
        {
          type: "doc",
          id: "api/interfaces/DeduplicatorEntry",
          label: "DeduplicatorEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/DeepgramBatchSTTProviderConfig",
          label: "DeepgramBatchSTTProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/DeleteOptions",
          label: "DeleteOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/DeleteResult",
          label: "DeleteResult"
        },
        {
          type: "doc",
          id: "api/interfaces/DescriptorOverride",
          label: "DescriptorOverride"
        },
        {
          type: "doc",
          id: "api/interfaces/DetectedLanguageResult",
          label: "DetectedLanguageResult"
        },
        {
          type: "doc",
          id: "api/interfaces/DetectScenesOptions",
          label: "DetectScenesOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/DiagnosticsView",
          label: "DiagnosticsView"
        },
        {
          type: "doc",
          id: "api/interfaces/DiscordAuthParams",
          label: "DiscordAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/DiscoveryPolicy",
          label: "DiscoveryPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/DocumentChunk",
          label: "DocumentChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/DocumentLayout",
          label: "DocumentLayout"
        },
        {
          type: "doc",
          id: "api/interfaces/DocumentMetadata",
          label: "DocumentMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/DocumentPage",
          label: "DocumentPage"
        },
        {
          type: "doc",
          id: "api/interfaces/DraftOutput",
          label: "DraftOutput"
        },
        {
          type: "doc",
          id: "api/interfaces/DriftEvent",
          label: "DriftEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/EditedOutput",
          label: "EditedOutput"
        },
        {
          type: "doc",
          id: "api/interfaces/EditImageOptions",
          label: "EditImageOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/EditImageResult",
          label: "EditImageResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ElevenLabsTextToSpeechProviderConfig",
          label: "ElevenLabsTextToSpeechProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/EmbeddingConfig",
          label: "EmbeddingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/EmbeddingRequest",
          label: "EmbeddingRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/EmbeddingResponse",
          label: "EmbeddingResponse"
        },
        {
          type: "doc",
          id: "api/interfaces/EmbedTextOptions",
          label: "EmbedTextOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/EmbedTextResult",
          label: "EmbedTextResult"
        },
        {
          type: "doc",
          id: "api/interfaces/EmergentAgentJudgeConfig",
          label: "EmergentAgentJudgeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/EmergentCapabilityEngineDeps",
          label: "EmergentCapabilityEngineDeps"
        },
        {
          type: "doc",
          id: "api/interfaces/EmergentConfig",
          label: "EmergentConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/EmergentJudgeConfig",
          label: "EmergentJudgeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/EmergentRegistryStorageAdapter",
          label: "EmergentRegistryStorageAdapter"
        },
        {
          type: "doc",
          id: "api/interfaces/EmergentTool",
          label: "EmergentTool"
        },
        {
          type: "doc",
          id: "api/interfaces/EmergentToolPackageManifest",
          label: "EmergentToolPackageManifest"
        },
        {
          type: "doc",
          id: "api/interfaces/EmotionalContext",
          label: "EmotionalContext"
        },
        {
          type: "doc",
          id: "api/interfaces/EncodingConfig",
          label: "EncodingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/EncodingResult",
          label: "EncodingResult"
        },
        {
          type: "doc",
          id: "api/interfaces/EncodingWeights",
          label: "EncodingWeights"
        },
        {
          type: "doc",
          id: "api/interfaces/EntityExtractionOptions",
          label: "EntityExtractionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/EntityExtractionResult",
          label: "EntityExtractionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/EpisodicMemory",
          label: "EpisodicMemory"
        },
        {
          type: "doc",
          id: "api/interfaces/EscalationContext",
          label: "EscalationContext"
        },
        {
          type: "doc",
          id: "api/interfaces/EvalComparison",
          label: "EvalComparison"
        },
        {
          type: "doc",
          id: "api/interfaces/EvalConfig",
          label: "EvalConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/EvalCriteria",
          label: "EvalCriteria"
        },
        {
          type: "doc",
          id: "api/interfaces/EvalRun",
          label: "EvalRun"
        },
        {
          type: "doc",
          id: "api/interfaces/EvalTestCase",
          label: "EvalTestCase"
        },
        {
          type: "doc",
          id: "api/interfaces/EvalTestResult",
          label: "EvalTestResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ExecutionFeedback",
          label: "ExecutionFeedback"
        },
        {
          type: "doc",
          id: "api/interfaces/ExecutionOutput",
          label: "ExecutionOutput"
        },
        {
          type: "doc",
          id: "api/interfaces/ExecutionPlan",
          label: "ExecutionPlan"
        },
        {
          type: "doc",
          id: "api/interfaces/ExecutionRequest",
          label: "ExecutionRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ExecutionResult",
          label: "ExecutionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ExecutionState",
          label: "ExecutionState"
        },
        {
          type: "doc",
          id: "api/interfaces/ExecutionSummary",
          label: "ExecutionSummary"
        },
        {
          type: "doc",
          id: "api/interfaces/ExpansionRecord",
          label: "ExpansionRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/ExplicitAssignment",
          label: "ExplicitAssignment"
        },
        {
          type: "doc",
          id: "api/interfaces/ExportedSpan",
          label: "ExportedSpan"
        },
        {
          type: "doc",
          id: "api/interfaces/ExportOptions",
          label: "ExportOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtendedConsolidationConfig",
          label: "ExtendedConsolidationConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtendedMissionConfig",
          label: "ExtendedMissionConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionContext",
          label: "ExtensionContext"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionDescriptor",
          label: "ExtensionDescriptor"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionDescriptorEvent",
          label: "ExtensionDescriptorEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionEventBase",
          label: "ExtensionEventBase"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionLifecycleContext",
          label: "ExtensionLifecycleContext"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionManifest",
          label: "ExtensionManifest"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionOverrides",
          label: "ExtensionOverrides"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionPack",
          label: "ExtensionPack"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionPackContext",
          label: "ExtensionPackContext"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionPackEvent",
          label: "ExtensionPackEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionSecretDefinition",
          label: "ExtensionSecretDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionSecretRequirement",
          label: "ExtensionSecretRequirement"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtensionSourceMetadata",
          label: "ExtensionSourceMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtractedImage",
          label: "ExtractedImage"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtractedTable",
          label: "ExtractedTable"
        },
        {
          type: "doc",
          id: "api/interfaces/ExtractionResult",
          label: "ExtractionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/FaceEmbedding",
          label: "FaceEmbedding"
        },
        {
          type: "doc",
          id: "api/interfaces/Fact",
          label: "Fact"
        },
        {
          type: "doc",
          id: "api/interfaces/FactExtractorOptions",
          label: "FactExtractorOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/FactExtractorSession",
          label: "FactExtractorSession"
        },
        {
          type: "doc",
          id: "api/interfaces/FactStoreEntry",
          label: "FactStoreEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/FactSupersessionInput",
          label: "FactSupersessionInput"
        },
        {
          type: "doc",
          id: "api/interfaces/FactSupersessionOptions",
          label: "FactSupersessionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/FactSupersessionResult",
          label: "FactSupersessionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/FactTemporal",
          label: "FactTemporal"
        },
        {
          type: "doc",
          id: "api/interfaces/FalImageProviderConfig",
          label: "FalImageProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/FalImageProviderOptions",
          label: "FalImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/FallbackProviderEntry",
          label: "FallbackProviderEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/FeatureFlag",
          label: "FeatureFlag"
        },
        {
          type: "doc",
          id: "api/interfaces/FlushReflectionResult",
          label: "FlushReflectionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/FluxImageProviderConfig",
          label: "FluxImageProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/FluxImageProviderOptions",
          label: "FluxImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ForgeDefaults",
          label: "ForgeDefaults"
        },
        {
          type: "doc",
          id: "api/interfaces/ForgeSchemaInferenceRequest",
          label: "ForgeSchemaInferenceRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ForgeShapeRequest",
          label: "ForgeShapeRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ForgeStats",
          label: "ForgeStats"
        },
        {
          type: "doc",
          id: "api/interfaces/ForgeTestCase",
          label: "ForgeTestCase"
        },
        {
          type: "doc",
          id: "api/interfaces/ForgeToolInput",
          label: "ForgeToolInput"
        },
        {
          type: "doc",
          id: "api/interfaces/ForgeToolRequest",
          label: "ForgeToolRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/FourWayRrfInput",
          label: "FourWayRrfInput"
        },
        {
          type: "doc",
          id: "api/interfaces/FourWayRrfOptions",
          label: "FourWayRrfOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/FunctionCallResult",
          label: "FunctionCallResult"
        },
        {
          type: "doc",
          id: "api/interfaces/FunctionDefinition",
          label: "FunctionDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateCompleteEvent",
          label: "GenerateCompleteEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/GeneratedAudio",
          label: "GeneratedAudio"
        },
        {
          type: "doc",
          id: "api/interfaces/GeneratedImage",
          label: "GeneratedImage"
        },
        {
          type: "doc",
          id: "api/interfaces/GeneratedVideo",
          label: "GeneratedVideo"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateImageOptions",
          label: "GenerateImageOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateImageResult",
          label: "GenerateImageResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateMusicOptions",
          label: "GenerateMusicOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateMusicResult",
          label: "GenerateMusicResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateObjectOptions",
          label: "GenerateObjectOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateObjectResult",
          label: "GenerateObjectResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateSFXOptions",
          label: "GenerateSFXOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateSFXResult",
          label: "GenerateSFXResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateStartEvent",
          label: "GenerateStartEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateTextOptions",
          label: "GenerateTextOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateTextResult",
          label: "GenerateTextResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateVideoOptions",
          label: "GenerateVideoOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerateVideoResult",
          label: "GenerateVideoResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerationHookContext",
          label: "GenerationHookContext"
        },
        {
          type: "doc",
          id: "api/interfaces/GenerationHookResult",
          label: "GenerationHookResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GlobalDefaultProvider",
          label: "GlobalDefaultProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/GlobalSearchResult",
          label: "GlobalSearchResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GMIAgencyContextOptions",
          label: "GMIAgencyContextOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GMIBaseConfig",
          label: "GMIBaseConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/GMICognitiveMemoryFactoryInput",
          label: "GMICognitiveMemoryFactoryInput"
        },
        {
          type: "doc",
          id: "api/interfaces/GMIHealthReport",
          label: "GMIHealthReport"
        },
        {
          type: "doc",
          id: "api/interfaces/GMIManagerConfig",
          label: "GMIManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/GMIOutput",
          label: "GMIOutput"
        },
        {
          type: "doc",
          id: "api/interfaces/GMIOutputChunk",
          label: "GMIOutputChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/GMITurnInput",
          label: "GMITurnInput"
        },
        {
          type: "doc",
          id: "api/interfaces/GoogleChatAuthParams",
          label: "GoogleChatAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphCommunity",
          label: "GraphCommunity"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphCompilerInput",
          label: "GraphCompilerInput"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphEdge",
          label: "GraphEdge"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphEntity",
          label: "GraphEntity"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphExpansionContext",
          label: "GraphExpansionContext"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphExpansionHandler",
          label: "GraphExpansionHandler"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphExpansionRequest",
          label: "GraphExpansionRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphExpansionResult",
          label: "GraphExpansionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphNode",
          label: "GraphNode"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphRAGConfig",
          label: "GraphRAGConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphRAGSearchOptions",
          label: "GraphRAGSearchOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphRelationship",
          label: "GraphRelationship"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphRuntimeConfig",
          label: "GraphRuntimeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphState",
          label: "GraphState"
        },
        {
          type: "doc",
          id: "api/interfaces/GraphTraversalConfig",
          label: "GraphTraversalConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardedToolResult",
          label: "GuardedToolResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailConfig",
          label: "GuardrailConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailContext",
          label: "GuardrailContext"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailEvaluationResult",
          label: "GuardrailEvaluationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailHitlOverrideResult",
          label: "GuardrailHitlOverrideResult"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailInputOutcome",
          label: "GuardrailInputOutcome"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailInputPayload",
          label: "GuardrailInputPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailOutputOptions",
          label: "GuardrailOutputOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailOutputPayload",
          label: "GuardrailOutputPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailPolicy",
          label: "GuardrailPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/GuardrailThresholds",
          label: "GuardrailThresholds"
        },
        {
          type: "doc",
          id: "api/interfaces/HandoffContext",
          label: "HandoffContext"
        },
        {
          type: "doc",
          id: "api/interfaces/HandoffResult",
          label: "HandoffResult"
        },
        {
          type: "doc",
          id: "api/interfaces/HangupCallInput",
          label: "HangupCallInput"
        },
        {
          type: "doc",
          id: "api/interfaces/HexacoTraits",
          label: "HexacoTraits"
        },
        {
          type: "doc",
          id: "api/interfaces/HitlConfig",
          label: "HitlConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/HITLHandlerPayload",
          label: "HITLHandlerPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/HITLNotification",
          label: "HITLNotification"
        },
        {
          type: "doc",
          id: "api/interfaces/HITLStatistics",
          label: "HITLStatistics"
        },
        {
          type: "doc",
          id: "api/interfaces/HnswlibVectorStoreConfig",
          label: "HnswlibVectorStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/HnswQueryResult",
          label: "HnswQueryResult"
        },
        {
          type: "doc",
          id: "api/interfaces/HnswSidecarConfig",
          label: "HnswSidecarConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/HostLLMPolicy",
          label: "HostLLMPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/HumanFeedback",
          label: "HumanFeedback"
        },
        {
          type: "doc",
          id: "api/interfaces/HumanInteractionManagerConfig",
          label: "HumanInteractionManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/HybridResult",
          label: "HybridResult"
        },
        {
          type: "doc",
          id: "api/interfaces/HybridRetrieveOptions",
          label: "HybridRetrieveOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/HybridRetrieverOptions",
          label: "HybridRetrieverOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/HybridSearcherConfig",
          label: "HybridSearcherConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/HybridUtilityAIConfig",
          label: "HybridUtilityAIConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/HydeConfig",
          label: "HydeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/HydeMultiRetrievalResult",
          label: "HydeMultiRetrievalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/HydeRetrievalResult",
          label: "HydeRetrievalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/IAgentCommunicationBus",
          label: "IAgentCommunicationBus"
        },
        {
          type: "doc",
          id: "api/interfaces/IAgentOrchestrator",
          label: "IAgentOrchestrator"
        },
        {
          type: "doc",
          id: "api/interfaces/IAudioGenerator",
          label: "IAudioGenerator"
        },
        {
          type: "doc",
          id: "api/interfaces/IChannelAdapter",
          label: "IChannelAdapter"
        },
        {
          type: "doc",
          id: "api/interfaces/ICheckpointStore",
          label: "ICheckpointStore"
        },
        {
          type: "doc",
          id: "api/interfaces/ICodeSandbox",
          label: "ICodeSandbox"
        },
        {
          type: "doc",
          id: "api/interfaces/ICognitiveMemoryManager",
          label: "ICognitiveMemoryManager"
        },
        {
          type: "doc",
          id: "api/interfaces/ICompactionStrategy",
          label: "ICompactionStrategy"
        },
        {
          type: "doc",
          id: "api/interfaces/IContentFeatureDetector",
          label: "IContentFeatureDetector"
        },
        {
          type: "doc",
          id: "api/interfaces/IConversation",
          label: "IConversation"
        },
        {
          type: "doc",
          id: "api/interfaces/IConversationMessage",
          label: "IConversationMessage"
        },
        {
          type: "doc",
          id: "api/interfaces/ICrossAgentGuardrailService",
          label: "ICrossAgentGuardrailService"
        },
        {
          type: "doc",
          id: "api/interfaces/IDocumentLoader",
          label: "IDocumentLoader"
        },
        {
          type: "doc",
          id: "api/interfaces/IEmbeddingManager",
          label: "IEmbeddingManager"
        },
        {
          type: "doc",
          id: "api/interfaces/IEvaluator",
          label: "IEvaluator"
        },
        {
          type: "doc",
          id: "api/interfaces/IFaceEmbeddingService",
          label: "IFaceEmbeddingService"
        },
        {
          type: "doc",
          id: "api/interfaces/IGMI",
          label: "IGMI"
        },
        {
          type: "doc",
          id: "api/interfaces/IGraphRAGEngine",
          label: "IGraphRAGEngine"
        },
        {
          type: "doc",
          id: "api/interfaces/IGuardrailService",
          label: "IGuardrailService"
        },
        {
          type: "doc",
          id: "api/interfaces/IHumanInteractionManager",
          label: "IHumanInteractionManager"
        },
        {
          type: "doc",
          id: "api/interfaces/IImageProvider",
          label: "IImageProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/IKnowledgeGraph",
          label: "IKnowledgeGraph"
        },
        {
          type: "doc",
          id: "api/interfaces/ILanguageDetectionProvider",
          label: "ILanguageDetectionProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/ILanguageDetectionProviderConfig",
          label: "ILanguageDetectionProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ILanguageService",
          label: "ILanguageService"
        },
        {
          type: "doc",
          id: "api/interfaces/ILogger",
          label: "ILogger"
        },
        {
          type: "doc",
          id: "api/interfaces/ILongTermMemoryRetriever",
          label: "ILongTermMemoryRetriever"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageEditRequest",
          label: "ImageEditRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageFallbackEvent",
          label: "ImageFallbackEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageGenerationRequest",
          label: "ImageGenerationRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageGenerationResult",
          label: "ImageGenerationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageIndexOptions",
          label: "ImageIndexOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageIndexResult",
          label: "ImageIndexResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageModelInfo",
          label: "ImageModelInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageOutputConfig",
          label: "ImageOutputConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageProviderOptionBag",
          label: "ImageProviderOptionBag"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageProviderPreference",
          label: "ImageProviderPreference"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageProviderUsage",
          label: "ImageProviderUsage"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageToVideoRequest",
          label: "ImageToVideoRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageUpscaleRequest",
          label: "ImageUpscaleRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ImageVariateRequest",
          label: "ImageVariateRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/IMarketplace",
          label: "IMarketplace"
        },
        {
          type: "doc",
          id: "api/interfaces/IMemoryGraph",
          label: "IMemoryGraph"
        },
        {
          type: "doc",
          id: "api/interfaces/IMessageQueryOptions",
          label: "IMessageQueryOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/IMigrationSource",
          label: "IMigrationSource"
        },
        {
          type: "doc",
          id: "api/interfaces/IMigrationTarget",
          label: "IMigrationTarget"
        },
        {
          type: "doc",
          id: "api/interfaces/IModelRouter",
          label: "IModelRouter"
        },
        {
          type: "doc",
          id: "api/interfaces/ImportOptions",
          label: "ImportOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ImportResult",
          label: "ImportResult"
        },
        {
          type: "doc",
          id: "api/interfaces/IndexSessionInput",
          label: "IndexSessionInput"
        },
        {
          type: "doc",
          id: "api/interfaces/InfiniteContextConfig",
          label: "InfiniteContextConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/IngestionConfig",
          label: "IngestionConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/IngestOptions",
          label: "IngestOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/IngestResult",
          label: "IngestResult"
        },
        {
          type: "doc",
          id: "api/interfaces/InitiateCallInput",
          label: "InitiateCallInput"
        },
        {
          type: "doc",
          id: "api/interfaces/InitiateCallResult",
          label: "InitiateCallResult"
        },
        {
          type: "doc",
          id: "api/interfaces/InstallationResult",
          label: "InstallationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/InstalledItem",
          label: "InstalledItem"
        },
        {
          type: "doc",
          id: "api/interfaces/InterferenceResult",
          label: "InterferenceResult"
        },
        {
          type: "doc",
          id: "api/interfaces/InterferenceVictim",
          label: "InterferenceVictim"
        },
        {
          type: "doc",
          id: "api/interfaces/IPersonaDefinition",
          label: "IPersonaDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/IPlanningEngine",
          label: "IPlanningEngine"
        },
        {
          type: "doc",
          id: "api/interfaces/IPromptEngine",
          label: "IPromptEngine"
        },
        {
          type: "doc",
          id: "api/interfaces/IPromptEngineUtilityAI",
          label: "IPromptEngineUtilityAI"
        },
        {
          type: "doc",
          id: "api/interfaces/IRCAuthParams",
          label: "IRCAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/IRetrievalAugmentor",
          label: "IRetrievalAugmentor"
        },
        {
          type: "doc",
          id: "api/interfaces/IRollingSummaryMemorySink",
          label: "IRollingSummaryMemorySink"
        },
        {
          type: "doc",
          id: "api/interfaces/ISharedServiceRegistry",
          label: "ISharedServiceRegistry"
        },
        {
          type: "doc",
          id: "api/interfaces/ISpan",
          label: "ISpan"
        },
        {
          type: "doc",
          id: "api/interfaces/ISpanExporter",
          label: "ISpanExporter"
        },
        {
          type: "doc",
          id: "api/interfaces/ISpeechToTextProvider",
          label: "ISpeechToTextProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/IStorageAdapter",
          label: "IStorageAdapter"
        },
        {
          type: "doc",
          id: "api/interfaces/IStreamingManager",
          label: "IStreamingManager"
        },
        {
          type: "doc",
          id: "api/interfaces/IStructuredOutputManager",
          label: "IStructuredOutputManager"
        },
        {
          type: "doc",
          id: "api/interfaces/ITaskOutcomeTelemetryStore",
          label: "ITaskOutcomeTelemetryStore"
        },
        {
          type: "doc",
          id: "api/interfaces/ItemDependency",
          label: "ItemDependency"
        },
        {
          type: "doc",
          id: "api/interfaces/ItemStats",
          label: "ItemStats"
        },
        {
          type: "doc",
          id: "api/interfaces/ITokenUsage",
          label: "ITokenUsage"
        },
        {
          type: "doc",
          id: "api/interfaces/ITool",
          label: "ITool"
        },
        {
          type: "doc",
          id: "api/interfaces/IToolPermissionManager",
          label: "IToolPermissionManager"
        },
        {
          type: "doc",
          id: "api/interfaces/ITracer",
          label: "ITracer"
        },
        {
          type: "doc",
          id: "api/interfaces/ITranslationProvider",
          label: "ITranslationProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/ITranslationProviderConfig",
          label: "ITranslationProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ITurnPlanner",
          label: "ITurnPlanner"
        },
        {
          type: "doc",
          id: "api/interfaces/ITypedExtractionLLM",
          label: "ITypedExtractionLLM"
        },
        {
          type: "doc",
          id: "api/interfaces/IUsageLedgerPersistence",
          label: "IUsageLedgerPersistence"
        },
        {
          type: "doc",
          id: "api/interfaces/IUtilityAI",
          label: "IUtilityAI"
        },
        {
          type: "doc",
          id: "api/interfaces/IVectorStore",
          label: "IVectorStore"
        },
        {
          type: "doc",
          id: "api/interfaces/IVectorStoreManager",
          label: "IVectorStoreManager"
        },
        {
          type: "doc",
          id: "api/interfaces/IVideoAnalyzer",
          label: "IVideoAnalyzer"
        },
        {
          type: "doc",
          id: "api/interfaces/IVideoGenerator",
          label: "IVideoGenerator"
        },
        {
          type: "doc",
          id: "api/interfaces/IVisionProvider",
          label: "IVisionProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/IVoiceCallProvider",
          label: "IVoiceCallProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/IWorkflowEngine",
          label: "IWorkflowEngine"
        },
        {
          type: "doc",
          id: "api/interfaces/IWorkflowStore",
          label: "IWorkflowStore"
        },
        {
          type: "doc",
          id: "api/interfaces/JSONSchema",
          label: "JSONSchema"
        },
        {
          type: "doc",
          id: "api/interfaces/JudgeCriteria",
          label: "JudgeCriteria"
        },
        {
          type: "doc",
          id: "api/interfaces/JudgmentResult",
          label: "JudgmentResult"
        },
        {
          type: "doc",
          id: "api/interfaces/KeywordExtractionOptions",
          label: "KeywordExtractionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/KnowledgeEntity",
          label: "KnowledgeEntity"
        },
        {
          type: "doc",
          id: "api/interfaces/KnowledgeGraphStats",
          label: "KnowledgeGraphStats"
        },
        {
          type: "doc",
          id: "api/interfaces/KnowledgeQueryOptions",
          label: "KnowledgeQueryOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/KnowledgeRelation",
          label: "KnowledgeRelation"
        },
        {
          type: "doc",
          id: "api/interfaces/KnowledgeSource",
          label: "KnowledgeSource"
        },
        {
          type: "doc",
          id: "api/interfaces/LanguageDetectionOptions",
          label: "LanguageDetectionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/LanguageDetectionResult",
          label: "LanguageDetectionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/LanguageNegotiationParams",
          label: "LanguageNegotiationParams"
        },
        {
          type: "doc",
          id: "api/interfaces/LanguageNegotiationResult",
          label: "LanguageNegotiationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/LayoutBlock",
          label: "LayoutBlock"
        },
        {
          type: "doc",
          id: "api/interfaces/LifecycleActionResponse",
          label: "LifecycleActionResponse"
        },
        {
          type: "doc",
          id: "api/interfaces/LLMJudgeConfig",
          label: "LLMJudgeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/LLMUtilityAIConfig",
          label: "LLMUtilityAIConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/LLMVisionProviderConfig",
          label: "LLMVisionProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/LoadedDocument",
          label: "LoadedDocument"
        },
        {
          type: "doc",
          id: "api/interfaces/LoadOptions",
          label: "LoadOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/LocalSearchResult",
          label: "LocalSearchResult"
        },
        {
          type: "doc",
          id: "api/interfaces/LongTermMemoryFeedbackInput",
          label: "LongTermMemoryFeedbackInput"
        },
        {
          type: "doc",
          id: "api/interfaces/LongTermMemoryPolicyInput",
          label: "LongTermMemoryPolicyInput"
        },
        {
          type: "doc",
          id: "api/interfaces/LongTermMemoryRetrievalInput",
          label: "LongTermMemoryRetrievalInput"
        },
        {
          type: "doc",
          id: "api/interfaces/LongTermMemoryRetrievalResult",
          label: "LongTermMemoryRetrievalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/LoopConfig",
          label: "LoopConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/LoopContext",
          label: "LoopContext"
        },
        {
          type: "doc",
          id: "api/interfaces/LoopProgress",
          label: "LoopProgress"
        },
        {
          type: "doc",
          id: "api/interfaces/LoopToolCallRequest",
          label: "LoopToolCallRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/LoopToolCallResult",
          label: "LoopToolCallResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ManageGraphInput",
          label: "ManageGraphInput"
        },
        {
          type: "doc",
          id: "api/interfaces/ManageGraphOutput",
          label: "ManageGraphOutput"
        },
        {
          type: "doc",
          id: "api/interfaces/MarketplaceConfig",
          label: "MarketplaceConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/MarketplaceItem",
          label: "MarketplaceItem"
        },
        {
          type: "doc",
          id: "api/interfaces/MarketplaceSearchOptions",
          label: "MarketplaceSearchOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/MarketplaceSearchResult",
          label: "MarketplaceSearchResult"
        },
        {
          type: "doc",
          id: "api/interfaces/MarketplaceStats",
          label: "MarketplaceStats"
        },
        {
          type: "doc",
          id: "api/interfaces/MaterializeEmergentToolFromPackageOptions",
          label: "MaterializeEmergentToolFromPackageOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/MechanismMetadata",
          label: "MechanismMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/MediaProviderPreference",
          label: "MediaProviderPreference"
        },
        {
          type: "doc",
          id: "api/interfaces/MediaStreamParser",
          label: "MediaStreamParser"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryAssemblerInput",
          label: "MemoryAssemblerInput"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryBudgetAllocation",
          label: "MemoryBudgetAllocation"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryCluster",
          label: "MemoryCluster"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryConfig",
          label: "MemoryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryConsolidationResult",
          label: "MemoryConsolidationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryEdge",
          label: "MemoryEdge"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryGraphConfig",
          label: "MemoryGraphConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryGraphNodeMeta",
          label: "MemoryGraphNodeMeta"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryHealth",
          label: "MemoryHealth"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryHealthReport",
          label: "MemoryHealthReport"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryLifecycleEvent",
          label: "MemoryLifecycleEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryPolicy",
          label: "MemoryPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryProvenance",
          label: "MemoryProvenance"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryProviderPayload",
          label: "MemoryProviderPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryReflectionResult",
          label: "MemoryReflectionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryRetrievalPolicy",
          label: "MemoryRetrievalPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryStoreConfig",
          label: "MemoryStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryToolsExtensionOptions",
          label: "MemoryToolsExtensionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryTrace",
          label: "MemoryTrace"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryTrustPolicy",
          label: "MemoryTrustPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/MemoryView",
          label: "MemoryView"
        },
        {
          type: "doc",
          id: "api/interfaces/Message",
          label: "Message"
        },
        {
          type: "doc",
          id: "api/interfaces/MessageButton",
          label: "MessageButton"
        },
        {
          type: "doc",
          id: "api/interfaces/MessageContent",
          label: "MessageContent"
        },
        {
          type: "doc",
          id: "api/interfaces/MessagingChannelPayload",
          label: "MessagingChannelPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/MetacognitiveSignal",
          label: "MetacognitiveSignal"
        },
        {
          type: "doc",
          id: "api/interfaces/MetadataFieldCondition",
          label: "MetadataFieldCondition"
        },
        {
          type: "doc",
          id: "api/interfaces/MetaPromptDefinition",
          label: "MetaPromptDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/MetricValue",
          label: "MetricValue"
        },
        {
          type: "doc",
          id: "api/interfaces/MigrationOptions",
          label: "MigrationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/MigrationResult",
          label: "MigrationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/MissionConfig",
          label: "MissionConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/MissionEvalScores",
          label: "MissionEvalScores"
        },
        {
          type: "doc",
          id: "api/interfaces/MissionGraphPatch",
          label: "MissionGraphPatch"
        },
        {
          type: "doc",
          id: "api/interfaces/ModelCompletionOptions",
          label: "ModelCompletionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ModelOption",
          label: "ModelOption"
        },
        {
          type: "doc",
          id: "api/interfaces/ModelRouteParams",
          label: "ModelRouteParams"
        },
        {
          type: "doc",
          id: "api/interfaces/ModelRouteResult",
          label: "ModelRouteResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ModelTargetInfo",
          label: "ModelTargetInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/ModelTargetPreference",
          label: "ModelTargetPreference"
        },
        {
          type: "doc",
          id: "api/interfaces/MultimodalIndexerConfig",
          label: "MultimodalIndexerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/MultimodalIndexerFromResolverOptions",
          label: "MultimodalIndexerFromResolverOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/MultimodalSearchOptions",
          label: "MultimodalSearchOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/MultimodalSearchResult",
          label: "MultimodalSearchResult"
        },
        {
          type: "doc",
          id: "api/interfaces/MultiRegistryConfig",
          label: "MultiRegistryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/MusicGenerateRequest",
          label: "MusicGenerateRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/Neo4jConnectionConfig",
          label: "Neo4jConnectionConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/NGramOptions",
          label: "NGramOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/NodeExecutionResult",
          label: "NodeExecutionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/NodeLlmConfig",
          label: "NodeLlmConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/NodePolicies",
          label: "NodePolicies"
        },
        {
          type: "doc",
          id: "api/interfaces/NodeProviderAssignment",
          label: "NodeProviderAssignment"
        },
        {
          type: "doc",
          id: "api/interfaces/NodeTelemetry",
          label: "NodeTelemetry"
        },
        {
          type: "doc",
          id: "api/interfaces/NoiseProfile",
          label: "NoiseProfile"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallAnswered",
          label: "NormalizedCallAnswered"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallBusy",
          label: "NormalizedCallBusy"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallCompleted",
          label: "NormalizedCallCompleted"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallError",
          label: "NormalizedCallError"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallFailed",
          label: "NormalizedCallFailed"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallHangupUser",
          label: "NormalizedCallHangupUser"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallNoAnswer",
          label: "NormalizedCallNoAnswer"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallRinging",
          label: "NormalizedCallRinging"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedCallVoicemail",
          label: "NormalizedCallVoicemail"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedDtmfReceived",
          label: "NormalizedDtmfReceived"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedMediaStreamConnected",
          label: "NormalizedMediaStreamConnected"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedSpeechStart",
          label: "NormalizedSpeechStart"
        },
        {
          type: "doc",
          id: "api/interfaces/NormalizedTranscript",
          label: "NormalizedTranscript"
        },
        {
          type: "doc",
          id: "api/interfaces/ObservationBufferConfig",
          label: "ObservationBufferConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ObservationNote",
          label: "ObservationNote"
        },
        {
          type: "doc",
          id: "api/interfaces/ObserverConfig",
          label: "ObserverConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/OCRResult",
          label: "OCRResult"
        },
        {
          type: "doc",
          id: "api/interfaces/OpenAIFunctionToolSchema",
          label: "OpenAIFunctionToolSchema"
        },
        {
          type: "doc",
          id: "api/interfaces/OpenAIImageProviderConfig",
          label: "OpenAIImageProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/OpenAIImageProviderOptions",
          label: "OpenAIImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/OpenAITextToSpeechProviderConfig",
          label: "OpenAITextToSpeechProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/OpenAIWhisperSpeechToTextProviderConfig",
          label: "OpenAIWhisperSpeechToTextProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/OpenRouterImageProviderConfig",
          label: "OpenRouterImageProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/OpenRouterImageProviderOptions",
          label: "OpenRouterImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/PADState",
          label: "PADState"
        },
        {
          type: "doc",
          id: "api/interfaces/ParallelFunctionCallOptions",
          label: "ParallelFunctionCallOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ParallelFunctionCallResult",
          label: "ParallelFunctionCallResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ParseJsonOptions",
          label: "ParseJsonOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/PartiallyRetrievedTrace",
          label: "PartiallyRetrievedTrace"
        },
        {
          type: "doc",
          id: "api/interfaces/Participant",
          label: "Participant"
        },
        {
          type: "doc",
          id: "api/interfaces/PendingAction",
          label: "PendingAction"
        },
        {
          type: "doc",
          id: "api/interfaces/PendingExternalToolExecutionOptions",
          label: "PendingExternalToolExecutionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/PendingExternalToolHandlerContext",
          label: "PendingExternalToolHandlerContext"
        },
        {
          type: "doc",
          id: "api/interfaces/PerformOCROptions",
          label: "PerformOCROptions"
        },
        {
          type: "doc",
          id: "api/interfaces/PermissionCheckContext",
          label: "PermissionCheckContext"
        },
        {
          type: "doc",
          id: "api/interfaces/PermissionCheckResult",
          label: "PermissionCheckResult"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaAvatarConfig",
          label: "PersonaAvatarConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaConversationContextConfig",
          label: "PersonaConversationContextConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaDriftConfig",
          label: "PersonaDriftConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaEvolutionContext",
          label: "PersonaEvolutionContext"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaEvolutionRule",
          label: "PersonaEvolutionRule"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonalityDriftProposal",
          label: "PersonalityDriftProposal"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonalityMutation",
          label: "PersonalityMutation"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaMemoryConfig",
          label: "PersonaMemoryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaMoodAdaptationConfig",
          label: "PersonaMoodAdaptationConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaPatch",
          label: "PersonaPatch"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaPolicy",
          label: "PersonaPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaRagConfigIngestionTrigger",
          label: "PersonaRagConfigIngestionTrigger"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaRagConfigRetrievalTrigger",
          label: "PersonaRagConfigRetrievalTrigger"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaRagDataSourceConfig",
          label: "PersonaRagDataSourceConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaRagIngestionProcessingConfig",
          label: "PersonaRagIngestionProcessingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaRegistrySource",
          label: "PersonaRegistrySource"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaStateOverlay",
          label: "PersonaStateOverlay"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaTaskContextDefaults",
          label: "PersonaTaskContextDefaults"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaUserContextDefaults",
          label: "PersonaUserContextDefaults"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaUtilityProcessingConfig",
          label: "PersonaUtilityProcessingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PersonaVoiceConfig",
          label: "PersonaVoiceConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PineconeVectorStoreConfig",
          label: "PineconeVectorStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanAction",
          label: "PlanAction"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanAdjustment",
          label: "PlanAdjustment"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanContext",
          label: "PlanContext"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanMetadata",
          label: "PlanMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/PlannerConfig",
          label: "PlannerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanningContext",
          label: "PlanningContext"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanningEngineConfig",
          label: "PlanningEngineConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanningOptions",
          label: "PlanningOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanningStrategyPayload",
          label: "PlanningStrategyPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanResult",
          label: "PlanResult"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanStep",
          label: "PlanStep"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanStepResult",
          label: "PlanStepResult"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanValidationIssue",
          label: "PlanValidationIssue"
        },
        {
          type: "doc",
          id: "api/interfaces/PlanValidationResult",
          label: "PlanValidationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/PlayTtsInput",
          label: "PlayTtsInput"
        },
        {
          type: "doc",
          id: "api/interfaces/PlivoProviderConfig",
          label: "PlivoProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PortableSandboxImplementation",
          label: "PortableSandboxImplementation"
        },
        {
          type: "doc",
          id: "api/interfaces/PostgresVectorStoreConfig",
          label: "PostgresVectorStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PricingInfo",
          label: "PricingInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/ProcessingOptions",
          label: "ProcessingOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/PromotionResult",
          label: "PromotionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/PromotionVerdict",
          label: "PromotionVerdict"
        },
        {
          type: "doc",
          id: "api/interfaces/PromptComponents",
          label: "PromptComponents"
        },
        {
          type: "doc",
          id: "api/interfaces/PromptEngineConfig",
          label: "PromptEngineConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PromptEngineResult",
          label: "PromptEngineResult"
        },
        {
          type: "doc",
          id: "api/interfaces/PromptExecutionContext",
          label: "PromptExecutionContext"
        },
        {
          type: "doc",
          id: "api/interfaces/ProspectiveMemoryItem",
          label: "ProspectiveMemoryItem"
        },
        {
          type: "doc",
          id: "api/interfaces/ProvenanceConfig",
          label: "ProvenanceConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ProvenanceSystemConfig",
          label: "ProvenanceSystemConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ProviderConfigEntry",
          label: "ProviderConfigEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/ProviderDefaults",
          label: "ProviderDefaults"
        },
        {
          type: "doc",
          id: "api/interfaces/ProviderFallbackEvent",
          label: "ProviderFallbackEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ProviderPreferences",
          label: "ProviderPreferences"
        },
        {
          type: "doc",
          id: "api/interfaces/ProviderRegistration",
          label: "ProviderRegistration"
        },
        {
          type: "doc",
          id: "api/interfaces/ProviderRequirements",
          label: "ProviderRequirements"
        },
        {
          type: "doc",
          id: "api/interfaces/ProviderStrategyConfig",
          label: "ProviderStrategyConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/PublisherInfo",
          label: "PublisherInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/QdrantVectorStoreConfig",
          label: "QdrantVectorStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/QueriedSession",
          label: "QueriedSession"
        },
        {
          type: "doc",
          id: "api/interfaces/QueryOptions",
          label: "QueryOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/QueryResult",
          label: "QueryResult"
        },
        {
          type: "doc",
          id: "api/interfaces/QueryRouterConfig",
          label: "QueryRouterConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/QueryRouterCorpusStats",
          label: "QueryRouterCorpusStats"
        },
        {
          type: "doc",
          id: "api/interfaces/QueryRouterResult",
          label: "QueryRouterResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RAGAuditCollectorOptions",
          label: "RAGAuditCollectorOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RAGAuditTrail",
          label: "RAGAuditTrail"
        },
        {
          type: "doc",
          id: "api/interfaces/RagDocumentInput",
          label: "RagDocumentInput"
        },
        {
          type: "doc",
          id: "api/interfaces/RagIngestionOptions",
          label: "RagIngestionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RagIngestionResult",
          label: "RagIngestionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RAGOperationEntry",
          label: "RAGOperationEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/RagRetrievalDiagnostics",
          label: "RagRetrievalDiagnostics"
        },
        {
          type: "doc",
          id: "api/interfaces/RagRetrievalOptions",
          label: "RagRetrievalOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RagRetrievalResult",
          label: "RagRetrievalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RagRetrievalScope",
          label: "RagRetrievalScope"
        },
        {
          type: "doc",
          id: "api/interfaces/RagRetrievedChunk",
          label: "RagRetrievedChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/RAGSourceAttribution",
          label: "RAGSourceAttribution"
        },
        {
          type: "doc",
          id: "api/interfaces/RankedDoc",
          label: "RankedDoc"
        },
        {
          type: "doc",
          id: "api/interfaces/RaptorInputChunk",
          label: "RaptorInputChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/RaptorResult",
          label: "RaptorResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RaptorTreeConfig",
          label: "RaptorTreeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/RaptorTreeStats",
          label: "RaptorTreeStats"
        },
        {
          type: "doc",
          id: "api/interfaces/RateLimitBannerThresholds",
          label: "RateLimitBannerThresholds"
        },
        {
          type: "doc",
          id: "api/interfaces/RateLimitInfoAuthenticated",
          label: "RateLimitInfoAuthenticated"
        },
        {
          type: "doc",
          id: "api/interfaces/RateLimitInfoPublic",
          label: "RateLimitInfoPublic"
        },
        {
          type: "doc",
          id: "api/interfaces/RatingSummary",
          label: "RatingSummary"
        },
        {
          type: "doc",
          id: "api/interfaces/ReadabilityOptions",
          label: "ReadabilityOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ReadabilityResult",
          label: "ReadabilityResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ReasoningTrace",
          label: "ReasoningTrace"
        },
        {
          type: "doc",
          id: "api/interfaces/ReasoningTraceEntry",
          label: "ReasoningTraceEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/RecallOptions",
          label: "RecallOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RecallResult",
          label: "RecallResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RecordMutationInput",
          label: "RecordMutationInput"
        },
        {
          type: "doc",
          id: "api/interfaces/RedditAuthParams",
          label: "RedditAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/Reflection",
          label: "Reflection"
        },
        {
          type: "doc",
          id: "api/interfaces/ReflectionResult",
          label: "ReflectionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ReflectorConfig",
          label: "ReflectorConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/RegisterAdapterOptions",
          label: "RegisterAdapterOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RegisteredExternalToolExecutionOptions",
          label: "RegisteredExternalToolExecutionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RegistrySource",
          label: "RegistrySource"
        },
        {
          type: "doc",
          id: "api/interfaces/RelationshipDriftInput",
          label: "RelationshipDriftInput"
        },
        {
          type: "doc",
          id: "api/interfaces/RememberOptions",
          label: "RememberOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RememberResult",
          label: "RememberResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RemoteUser",
          label: "RemoteUser"
        },
        {
          type: "doc",
          id: "api/interfaces/ReplicateFaceEmbeddingConfig",
          label: "ReplicateFaceEmbeddingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ReplicateImageProviderConfig",
          label: "ReplicateImageProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ReplicateImageProviderOptions",
          label: "ReplicateImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RequestExpansionInput",
          label: "RequestExpansionInput"
        },
        {
          type: "doc",
          id: "api/interfaces/RequestExpansionOutput",
          label: "RequestExpansionOutput"
        },
        {
          type: "doc",
          id: "api/interfaces/ResearchCompleteEvent",
          label: "ResearchCompleteEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ResearchPhaseEvent",
          label: "ResearchPhaseEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ResearchStartEvent",
          label: "ResearchStartEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/ResolvedLongTermMemoryPolicy",
          label: "ResolvedLongTermMemoryPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/ResolvedMechanismsConfig",
          label: "ResolvedMechanismsConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ResolvedMemoryRetrievalPolicy",
          label: "ResolvedMemoryRetrievalPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/ResolveSkillsDirsOptions",
          label: "ResolveSkillsDirsOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/ResourceControls",
          label: "ResourceControls"
        },
        {
          type: "doc",
          id: "api/interfaces/ResumeExternalToolRequestWithRegisteredToolsOptions",
          label: "ResumeExternalToolRequestWithRegisteredToolsOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrievalFeedback",
          label: "RetrievalFeedback"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrievalPlan",
          label: "RetrievalPlan"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrievalPlanSources",
          label: "RetrievalPlanSources"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrievalResult",
          label: "RetrievalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrievalUpdateResult",
          label: "RetrievalUpdateResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrieveCompleteEvent",
          label: "RetrieveCompleteEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrievedChunk",
          label: "RetrievedChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrievedVectorDocument",
          label: "RetrievedVectorDocument"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrieveFallbackEvent",
          label: "RetrieveFallbackEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrieveGraphEvent",
          label: "RetrieveGraphEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrieveRerankEvent",
          label: "RetrieveRerankEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrieveStartEvent",
          label: "RetrieveStartEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/RetrieveVectorEvent",
          label: "RetrieveVectorEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/RetryConfig",
          label: "RetryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/RetryPolicy",
          label: "RetryPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/ReuseVerdict",
          label: "ReuseVerdict"
        },
        {
          type: "doc",
          id: "api/interfaces/Review",
          label: "Review"
        },
        {
          type: "doc",
          id: "api/interfaces/RevisionRecord",
          label: "RevisionRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/RollingSummaryCompactionProfileDefinition",
          label: "RollingSummaryCompactionProfileDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/RollingSummaryCompactionProfilesConfig",
          label: "RollingSummaryCompactionProfilesConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/RollingSummaryMemoryUpdate",
          label: "RollingSummaryMemoryUpdate"
        },
        {
          type: "doc",
          id: "api/interfaces/RouteCompleteEvent",
          label: "RouteCompleteEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/RRFOptions",
          label: "RRFOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/RRFResult",
          label: "RRFResult"
        },
        {
          type: "doc",
          id: "api/interfaces/RunInspection",
          label: "RunInspection"
        },
        {
          type: "doc",
          id: "api/interfaces/SandboxConfig",
          label: "SandboxConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SandboxedToolForgeConfig",
          label: "SandboxedToolForgeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SandboxedToolSpec",
          label: "SandboxedToolSpec"
        },
        {
          type: "doc",
          id: "api/interfaces/SandboxExecutionRequest",
          label: "SandboxExecutionRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/SandboxExecutionResult",
          label: "SandboxExecutionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/SandboxFile",
          label: "SandboxFile"
        },
        {
          type: "doc",
          id: "api/interfaces/SandboxStats",
          label: "SandboxStats"
        },
        {
          type: "doc",
          id: "api/interfaces/SceneDescription",
          label: "SceneDescription"
        },
        {
          type: "doc",
          id: "api/interfaces/ScoredMemoryTrace",
          label: "ScoredMemoryTrace"
        },
        {
          type: "doc",
          id: "api/interfaces/ScoredTrace",
          label: "ScoredTrace"
        },
        {
          type: "doc",
          id: "api/interfaces/ScoringContext",
          label: "ScoringContext"
        },
        {
          type: "doc",
          id: "api/interfaces/ScoringWeights",
          label: "ScoringWeights"
        },
        {
          type: "doc",
          id: "api/interfaces/SearchOptions",
          label: "SearchOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SecurityEvent",
          label: "SecurityEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SelfImprovementConfig",
          label: "SelfImprovementConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SelfImprovementToolDeps",
          label: "SelfImprovementToolDeps"
        },
        {
          type: "doc",
          id: "api/interfaces/SemanticChunk",
          label: "SemanticChunk"
        },
        {
          type: "doc",
          id: "api/interfaces/SemanticChunkerConfig",
          label: "SemanticChunkerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SemanticSearchOptions",
          label: "SemanticSearchOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SemanticSearchResult",
          label: "SemanticSearchResult"
        },
        {
          type: "doc",
          id: "api/interfaces/SentimentAnalysisOptions",
          label: "SentimentAnalysisOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SentimentResult",
          label: "SentimentResult"
        },
        {
          type: "doc",
          id: "api/interfaces/SentimentTrackingConfig",
          label: "SentimentTrackingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SessionRetrieveOptions",
          label: "SessionRetrieveOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SessionRetrieverOptions",
          label: "SessionRetrieverOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SessionSendOptions",
          label: "SessionSendOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SessionSendStructuredResult",
          label: "SessionSendStructuredResult"
        },
        {
          type: "doc",
          id: "api/interfaces/SessionSummarizerOptions",
          label: "SessionSummarizerOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SessionSummaryStoreOptions",
          label: "SessionSummaryStoreOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SetupConfig",
          label: "SetupConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SFXGenerateRequest",
          label: "SFXGenerateRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/SharedServiceOptions",
          label: "SharedServiceOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SignalAuthParams",
          label: "SignalAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/SignedEvent",
          label: "SignedEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SilenceDetectorConfig",
          label: "SilenceDetectorConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SimilarityOptions",
          label: "SimilarityOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SimplePlan",
          label: "SimplePlan"
        },
        {
          type: "doc",
          id: "api/interfaces/Skill",
          label: "Skill"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillCommandDispatch",
          label: "SkillCommandDispatch"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillCommandSpec",
          label: "SkillCommandSpec"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillConfig",
          label: "SkillConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillEligibilityContext",
          label: "SkillEligibilityContext"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillEntry",
          label: "SkillEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillInstallSpec",
          label: "SkillInstallSpec"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillInvocationPolicy",
          label: "SkillInvocationPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillMetadata",
          label: "SkillMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillRegistryOptions",
          label: "SkillRegistryOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillRequirements",
          label: "SkillRequirements"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillsConfig",
          label: "SkillsConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillsInstallPreferences",
          label: "SkillsInstallPreferences"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillsLoadConfig",
          label: "SkillsLoadConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SkillSnapshot",
          label: "SkillSnapshot"
        },
        {
          type: "doc",
          id: "api/interfaces/SlackAuthParams",
          label: "SlackAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/SourceCitation",
          label: "SourceCitation"
        },
        {
          type: "doc",
          id: "api/interfaces/SourceDiagnostics",
          label: "SourceDiagnostics"
        },
        {
          type: "doc",
          id: "api/interfaces/SpanEvent",
          label: "SpanEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpanLink",
          label: "SpanLink"
        },
        {
          type: "doc",
          id: "api/interfaces/SpanOptions",
          label: "SpanOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechAudioAnalysis",
          label: "SpeechAudioAnalysis"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechAudioInput",
          label: "SpeechAudioInput"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechProviderCatalogEntry",
          label: "SpeechProviderCatalogEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechResolverConfig",
          label: "SpeechResolverConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechRuntimeConfig",
          label: "SpeechRuntimeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechRuntimeSessionConfig",
          label: "SpeechRuntimeSessionConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionAudioCapture",
          label: "SpeechSessionAudioCapture"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionConfig",
          label: "SpeechSessionConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionErrorEvent",
          label: "SpeechSessionErrorEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionEventMap",
          label: "SpeechSessionEventMap"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionProviders",
          label: "SpeechSessionProviders"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionSpeechEndedEvent",
          label: "SpeechSessionSpeechEndedEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionSpeechStartedEvent",
          label: "SpeechSessionSpeechStartedEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionStateChangedEvent",
          label: "SpeechSessionStateChangedEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionSynthesisCompletedEvent",
          label: "SpeechSessionSynthesisCompletedEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionSynthesisStartedEvent",
          label: "SpeechSessionSynthesisStartedEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionTranscriptEvent",
          label: "SpeechSessionTranscriptEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionUtteranceCapturedEvent",
          label: "SpeechSessionUtteranceCapturedEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSessionWakeWordEvent",
          label: "SpeechSessionWakeWordEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSynthesisOptions",
          label: "SpeechSynthesisOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechSynthesisResult",
          label: "SpeechSynthesisResult"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechToTextProvider",
          label: "SpeechToTextProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechTranscriptionOptions",
          label: "SpeechTranscriptionOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechTranscriptionRequestOptions",
          label: "SpeechTranscriptionRequestOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechTranscriptionResult",
          label: "SpeechTranscriptionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechTranscriptionSegment",
          label: "SpeechTranscriptionSegment"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechTranscriptionWord",
          label: "SpeechTranscriptionWord"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechVadDecision",
          label: "SpeechVadDecision"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechVadProvider",
          label: "SpeechVadProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/SpeechVoice",
          label: "SpeechVoice"
        },
        {
          type: "doc",
          id: "api/interfaces/SpreadingActivationConfig",
          label: "SpreadingActivationConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SpreadingActivationInput",
          label: "SpreadingActivationInput"
        },
        {
          type: "doc",
          id: "api/interfaces/SpreadOptions",
          label: "SpreadOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SqlTaskOutcomeTelemetryStoreConfig",
          label: "SqlTaskOutcomeTelemetryStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SqlVectorStoreConfig",
          label: "SqlVectorStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/StabilityImageProviderConfig",
          label: "StabilityImageProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/StabilityImageProviderOptions",
          label: "StabilityImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StableDiffusionLocalImageProviderOptions",
          label: "StableDiffusionLocalImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StableDiffusionLocalOptions",
          label: "StableDiffusionLocalOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StandaloneMemoryDescriptorOptions",
          label: "StandaloneMemoryDescriptorOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StandaloneMemoryLongTermRetrieverOptions",
          label: "StandaloneMemoryLongTermRetrieverOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StandaloneMemoryRollingSummarySinkOptions",
          label: "StandaloneMemoryRollingSummarySinkOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StartListeningInput",
          label: "StartListeningInput"
        },
        {
          type: "doc",
          id: "api/interfaces/StartWorkflowOptions",
          label: "StartWorkflowOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StateReducers",
          label: "StateReducers"
        },
        {
          type: "doc",
          id: "api/interfaces/StatisticalUtilityAIConfig",
          label: "StatisticalUtilityAIConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/StemmingOptions",
          label: "StemmingOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StepConfig",
          label: "StepConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/StepExecutionContext",
          label: "StepExecutionContext"
        },
        {
          type: "doc",
          id: "api/interfaces/StopListeningInput",
          label: "StopListeningInput"
        },
        {
          type: "doc",
          id: "api/interfaces/StoragePolicyConfig",
          label: "StoragePolicyConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/StreamingManagerConfig",
          label: "StreamingManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/StreamObjectOptions",
          label: "StreamObjectOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StreamObjectResult",
          label: "StreamObjectResult"
        },
        {
          type: "doc",
          id: "api/interfaces/StreamTextResult",
          label: "StreamTextResult"
        },
        {
          type: "doc",
          id: "api/interfaces/StructuredGenerationOptions",
          label: "StructuredGenerationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/StructuredGenerationResult",
          label: "StructuredGenerationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/StructuredOutputManagerConfig",
          label: "StructuredOutputManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/StructuredOutputStats",
          label: "StructuredOutputStats"
        },
        {
          type: "doc",
          id: "api/interfaces/StuckDetection",
          label: "StuckDetection"
        },
        {
          type: "doc",
          id: "api/interfaces/StuckDetectorConfig",
          label: "StuckDetectorConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/SubTask",
          label: "SubTask"
        },
        {
          type: "doc",
          id: "api/interfaces/SummarizationOptions",
          label: "SummarizationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/SummarizerStats",
          label: "SummarizerStats"
        },
        {
          type: "doc",
          id: "api/interfaces/SummaryChainNode",
          label: "SummaryChainNode"
        },
        {
          type: "doc",
          id: "api/interfaces/SystemContentBlock",
          label: "SystemContentBlock"
        },
        {
          type: "doc",
          id: "api/interfaces/TaskContext",
          label: "TaskContext"
        },
        {
          type: "doc",
          id: "api/interfaces/TaskDecomposition",
          label: "TaskDecomposition"
        },
        {
          type: "doc",
          id: "api/interfaces/TeamsAuthParams",
          label: "TeamsAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/TelegramAuthParams",
          label: "TelegramAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/TelephonyStreamTransportConfig",
          label: "TelephonyStreamTransportConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/TelnyxProviderConfig",
          label: "TelnyxProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/TemporalConfig",
          label: "TemporalConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/TemporalMetadata",
          label: "TemporalMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/TextNormalizationOptions",
          label: "TextNormalizationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/TextToSpeechProvider",
          label: "TextToSpeechProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/TokenizationOptions",
          label: "TokenizationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/TokenUsage",
          label: "TokenUsage"
        },
        {
          type: "doc",
          id: "api/interfaces/TombstoneRecord",
          label: "TombstoneRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolCallHookInfo",
          label: "ToolCallHookInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolCallRecord",
          label: "ToolCallRecord"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolCallRequest",
          label: "ToolCallRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolCallResult",
          label: "ToolCallResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolCandidate",
          label: "ToolCandidate"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolExecutionContext",
          label: "ToolExecutionContext"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolExecutionGuardConfig",
          label: "ToolExecutionGuardConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolExecutionResult",
          label: "ToolExecutionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolHealthReport",
          label: "ToolHealthReport"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolOrchestratorConfig",
          label: "ToolOrchestratorConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolOrchestratorHITLConfig",
          label: "ToolOrchestratorHITLConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolPermissionManagerConfig",
          label: "ToolPermissionManagerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolRegistrySettings",
          label: "ToolRegistrySettings"
        },
        {
          type: "doc",
          id: "api/interfaces/ToolUsageStats",
          label: "ToolUsageStats"
        },
        {
          type: "doc",
          id: "api/interfaces/TopicEntry",
          label: "TopicEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/TraceContext",
          label: "TraceContext"
        },
        {
          type: "doc",
          id: "api/interfaces/TracerConfig",
          label: "TracerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/TracerStats",
          label: "TracerStats"
        },
        {
          type: "doc",
          id: "api/interfaces/TranscriptEntry",
          label: "TranscriptEntry"
        },
        {
          type: "doc",
          id: "api/interfaces/TranslationOptions",
          label: "TranslationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/TranslationResult",
          label: "TranslationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/TraversalOptions",
          label: "TraversalOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/TraversalResult",
          label: "TraversalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/TurnCapabilityPlan",
          label: "TurnCapabilityPlan"
        },
        {
          type: "doc",
          id: "api/interfaces/TurnExecutionPolicy",
          label: "TurnExecutionPolicy"
        },
        {
          type: "doc",
          id: "api/interfaces/TurnPlan",
          label: "TurnPlan"
        },
        {
          type: "doc",
          id: "api/interfaces/TurnPlannerConfig",
          label: "TurnPlannerConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/TurnPlannerDiscoveryConfig",
          label: "TurnPlannerDiscoveryConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/TurnPlanningDiagnostics",
          label: "TurnPlanningDiagnostics"
        },
        {
          type: "doc",
          id: "api/interfaces/TurnPlanningRequestContext",
          label: "TurnPlanningRequestContext"
        },
        {
          type: "doc",
          id: "api/interfaces/TwilioProviderConfig",
          label: "TwilioProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/TwitterAuthParams",
          label: "TwitterAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/TypedEdge",
          label: "TypedEdge"
        },
        {
          type: "doc",
          id: "api/interfaces/TypedFact",
          label: "TypedFact"
        },
        {
          type: "doc",
          id: "api/interfaces/TypedNetworkObserverOptions",
          label: "TypedNetworkObserverOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/TypedNetworkRetrieveOptions",
          label: "TypedNetworkRetrieveOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/TypedNetworkRetrieverOptions",
          label: "TypedNetworkRetrieverOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/TypedSpreadingActivationOptions",
          label: "TypedSpreadingActivationOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/UICommand",
          label: "UICommand"
        },
        {
          type: "doc",
          id: "api/interfaces/UnifiedRetrievalResult",
          label: "UnifiedRetrievalResult"
        },
        {
          type: "doc",
          id: "api/interfaces/UnifiedRetrieverDeps",
          label: "UnifiedRetrieverDeps"
        },
        {
          type: "doc",
          id: "api/interfaces/UpscaleImageOptions",
          label: "UpscaleImageOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/UpscaleImageResult",
          label: "UpscaleImageResult"
        },
        {
          type: "doc",
          id: "api/interfaces/UpsertOptions",
          label: "UpsertOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/UpsertResult",
          label: "UpsertResult"
        },
        {
          type: "doc",
          id: "api/interfaces/UsageDimensions",
          label: "UsageDimensions"
        },
        {
          type: "doc",
          id: "api/interfaces/UsageLedgerOptions",
          label: "UsageLedgerOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/UserContext",
          label: "UserContext"
        },
        {
          type: "doc",
          id: "api/interfaces/UserFeedbackPayload",
          label: "UserFeedbackPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/UtilityAIConfigBase",
          label: "UtilityAIConfigBase"
        },
        {
          type: "doc",
          id: "api/interfaces/VADResult",
          label: "VADResult"
        },
        {
          type: "doc",
          id: "api/interfaces/ValidationIssue",
          label: "ValidationIssue"
        },
        {
          type: "doc",
          id: "api/interfaces/ValidationResult",
          label: "ValidationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/VariateImageOptions",
          label: "VariateImageOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/VariateImageResult",
          label: "VariateImageResult"
        },
        {
          type: "doc",
          id: "api/interfaces/VectorDocument",
          label: "VectorDocument"
        },
        {
          type: "doc",
          id: "api/interfaces/VectorStoreConfig",
          label: "VectorStoreConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/VectorStoreManagerHealthReport",
          label: "VectorStoreManagerHealthReport"
        },
        {
          type: "doc",
          id: "api/interfaces/VectorStoreProviderConfig",
          label: "VectorStoreProviderConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/VerificationBundle",
          label: "VerificationBundle"
        },
        {
          type: "doc",
          id: "api/interfaces/VerificationError",
          label: "VerificationError"
        },
        {
          type: "doc",
          id: "api/interfaces/VerificationResult",
          label: "VerificationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/VerificationSource",
          label: "VerificationSource"
        },
        {
          type: "doc",
          id: "api/interfaces/VerifiedResponse",
          label: "VerifiedResponse"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoAnalysis",
          label: "VideoAnalysis"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoAnalysisProgressEvent",
          label: "VideoAnalysisProgressEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoAnalysisRich",
          label: "VideoAnalysisRich"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoAnalyzerDeps",
          label: "VideoAnalyzerDeps"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoAnalyzeRequest",
          label: "VideoAnalyzeRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoAnalyzeRequestRich",
          label: "VideoAnalyzeRequestRich"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoFallbackEvent",
          label: "VideoFallbackEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoGenerateRequest",
          label: "VideoGenerateRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoModelInfo",
          label: "VideoModelInfo"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoProgressEvent",
          label: "VideoProgressEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoProviderUsage",
          label: "VideoProviderUsage"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoResult",
          label: "VideoResult"
        },
        {
          type: "doc",
          id: "api/interfaces/VideoScene",
          label: "VideoScene"
        },
        {
          type: "doc",
          id: "api/interfaces/VisionInputData",
          label: "VisionInputData"
        },
        {
          type: "doc",
          id: "api/interfaces/VisionPipelineConfig",
          label: "VisionPipelineConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/VisionPreprocessingConfig",
          label: "VisionPreprocessingConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/VisionResult",
          label: "VisionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/VisionTextRegion",
          label: "VisionTextRegion"
        },
        {
          type: "doc",
          id: "api/interfaces/VisionTierResult",
          label: "VisionTierResult"
        },
        {
          type: "doc",
          id: "api/interfaces/VoiceCallConfig",
          label: "VoiceCallConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/VoiceCallSttConfig",
          label: "VoiceCallSttConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/VoiceCallTtsConfig",
          label: "VoiceCallTtsConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/VoiceNodeConfig",
          label: "VoiceNodeConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/WakeWordDetection",
          label: "WakeWordDetection"
        },
        {
          type: "doc",
          id: "api/interfaces/WakeWordProvider",
          label: "WakeWordProvider"
        },
        {
          type: "doc",
          id: "api/interfaces/WebChatAuthParams",
          label: "WebChatAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/WebhookContext",
          label: "WebhookContext"
        },
        {
          type: "doc",
          id: "api/interfaces/WebhookParseResult",
          label: "WebhookParseResult"
        },
        {
          type: "doc",
          id: "api/interfaces/WebhookVerificationResult",
          label: "WebhookVerificationResult"
        },
        {
          type: "doc",
          id: "api/interfaces/WhatsAppAuthParams",
          label: "WhatsAppAuthParams"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowAgencySeatSnapshot",
          label: "WorkflowAgencySeatSnapshot"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowCheckpoint",
          label: "WorkflowCheckpoint"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowCreateInput",
          label: "WorkflowCreateInput"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowDefinition",
          label: "WorkflowDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowDefinitionMetadata",
          label: "WorkflowDefinitionMetadata"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowDescriptorPayload",
          label: "WorkflowDescriptorPayload"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowEngineConfig",
          label: "WorkflowEngineConfig"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowEngineDependencies",
          label: "WorkflowEngineDependencies"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowEngineEventListener",
          label: "WorkflowEngineEventListener"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowEvent",
          label: "WorkflowEvent"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowExtensionExecutionContext",
          label: "WorkflowExtensionExecutionContext"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowExtensionExecutionResult",
          label: "WorkflowExtensionExecutionResult"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowInstance",
          label: "WorkflowInstance"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowInvocationRequest",
          label: "WorkflowInvocationRequest"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowProgressUpdate",
          label: "WorkflowProgressUpdate"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowQueryOptions",
          label: "WorkflowQueryOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowRoleDefinition",
          label: "WorkflowRoleDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowTaskDefinition",
          label: "WorkflowTaskDefinition"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowTaskInstance",
          label: "WorkflowTaskInstance"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkflowTaskUpdate",
          label: "WorkflowTaskUpdate"
        },
        {
          type: "doc",
          id: "api/interfaces/WorkingMemorySlot",
          label: "WorkingMemorySlot"
        },
        {
          type: "doc",
          id: "api/interfaces/WrapForgeToolOptions",
          label: "WrapForgeToolOptions"
        },
        {
          type: "doc",
          id: "api/interfaces/WriteResult",
          label: "WriteResult"
        },
        {
          type: "doc",
          id: "api/type-aliases/ActionSeverity",
          label: "ActionSeverity"
        },
        {
          type: "doc",
          id: "api/type-aliases/ActiveTraceMetadata",
          label: "ActiveTraceMetadata"
        },
        {
          type: "doc",
          id: "api/type-aliases/AdaptableToolInput",
          label: "AdaptableToolInput"
        },
        {
          type: "doc",
          id: "api/type-aliases/Agency",
          label: "Agency"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgencyStrategy",
          label: "AgencyStrategy"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgencyStreamPart",
          label: "AgencyStreamPart"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgencyTraceEvent",
          label: "AgencyTraceEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgentMessageType",
          label: "AgentMessageType"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgentOSActionableToolCallRequestChunk",
          label: "AgentOSActionableToolCallRequestChunk"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgentOSExternalToolHandler",
          label: "AgentOSExternalToolHandler"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgentOSObservabilityState",
          label: "AgentOSObservabilityState"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgentOSResponse",
          label: "AgentOSResponse"
        },
        {
          type: "doc",
          id: "api/type-aliases/AgentOSToolCallExecutionMode",
          label: "AgentOSToolCallExecutionMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/AttributeValue",
          label: "AttributeValue"
        },
        {
          type: "doc",
          id: "api/type-aliases/AudioOutputFormat",
          label: "AudioOutputFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/AudioProviderFactory",
          label: "AudioProviderFactory"
        },
        {
          type: "doc",
          id: "api/type-aliases/AudioProviderId",
          label: "AudioProviderId"
        },
        {
          type: "doc",
          id: "api/type-aliases/AutonomyMode",
          label: "AutonomyMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/BackendType",
          label: "BackendType"
        },
        {
          type: "doc",
          id: "api/type-aliases/BankId",
          label: "BankId"
        },
        {
          type: "doc",
          id: "api/type-aliases/BoundaryType",
          label: "BoundaryType"
        },
        {
          type: "doc",
          id: "api/type-aliases/BuiltinReducer",
          label: "BuiltinReducer"
        },
        {
          type: "doc",
          id: "api/type-aliases/BuiltInScorer",
          label: "BuiltInScorer"
        },
        {
          type: "doc",
          id: "api/type-aliases/ButtonCallbackEvent",
          label: "ButtonCallbackEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/CallDirection",
          label: "CallDirection"
        },
        {
          type: "doc",
          id: "api/type-aliases/CallId",
          label: "CallId"
        },
        {
          type: "doc",
          id: "api/type-aliases/CallManagerEventHandler",
          label: "CallManagerEventHandler"
        },
        {
          type: "doc",
          id: "api/type-aliases/CallManagerEventType",
          label: "CallManagerEventType"
        },
        {
          type: "doc",
          id: "api/type-aliases/CallMode",
          label: "CallMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/CallState",
          label: "CallState"
        },
        {
          type: "doc",
          id: "api/type-aliases/ChannelCapability",
          label: "ChannelCapability"
        },
        {
          type: "doc",
          id: "api/type-aliases/ChannelConnectionStatus",
          label: "ChannelConnectionStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/ChannelEventHandler",
          label: "ChannelEventHandler"
        },
        {
          type: "doc",
          id: "api/type-aliases/ChannelEventType",
          label: "ChannelEventType"
        },
        {
          type: "doc",
          id: "api/type-aliases/ChannelPlatform",
          label: "ChannelPlatform"
        },
        {
          type: "doc",
          id: "api/type-aliases/CircuitState",
          label: "CircuitState"
        },
        {
          type: "doc",
          id: "api/type-aliases/ClaimVerdictKind",
          label: "ClaimVerdictKind"
        },
        {
          type: "doc",
          id: "api/type-aliases/CommunicationChannelDescriptor",
          label: "CommunicationChannelDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/CompactionStrategy",
          label: "CompactionStrategy"
        },
        {
          type: "doc",
          id: "api/type-aliases/CompressionPriority",
          label: "CompressionPriority"
        },
        {
          type: "doc",
          id: "api/type-aliases/ContentModality",
          label: "ContentModality"
        },
        {
          type: "doc",
          id: "api/type-aliases/ConversationType",
          label: "ConversationType"
        },
        {
          type: "doc",
          id: "api/type-aliases/CostCapType",
          label: "CostCapType"
        },
        {
          type: "doc",
          id: "api/type-aliases/DeepPartial",
          label: "DeepPartial"
        },
        {
          type: "doc",
          id: "api/type-aliases/DescriptionDetail",
          label: "DescriptionDetail"
        },
        {
          type: "doc",
          id: "api/type-aliases/EdgeKind",
          label: "EdgeKind"
        },
        {
          type: "doc",
          id: "api/type-aliases/EffectClass",
          label: "EffectClass"
        },
        {
          type: "doc",
          id: "api/type-aliases/EntityId",
          label: "EntityId"
        },
        {
          type: "doc",
          id: "api/type-aliases/EntityType",
          label: "EntityType"
        },
        {
          type: "doc",
          id: "api/type-aliases/EscalationDecision",
          label: "EscalationDecision"
        },
        {
          type: "doc",
          id: "api/type-aliases/EscalationReason",
          label: "EscalationReason"
        },
        {
          type: "doc",
          id: "api/type-aliases/EvalScores",
          label: "EvalScores"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExecutionStatus",
          label: "ExecutionStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExpansionTrigger",
          label: "ExpansionTrigger"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExtensionEvent",
          label: "ExtensionEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExtensionEventListener",
          label: "ExtensionEventListener"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExtensionEventType",
          label: "ExtensionEventType"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExtensionKind",
          label: "ExtensionKind"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExtensionPackManifestEntry",
          label: "ExtensionPackManifestEntry"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExtensionPackResolver",
          label: "ExtensionPackResolver"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExternalToolExecutor",
          label: "ExternalToolExecutor"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExternalToolRegistry",
          label: "ExternalToolRegistry"
        },
        {
          type: "doc",
          id: "api/type-aliases/ExternalToolRegistryEntry",
          label: "ExternalToolRegistryEntry"
        },
        {
          type: "doc",
          id: "api/type-aliases/FeedbackType",
          label: "FeedbackType"
        },
        {
          type: "doc",
          id: "api/type-aliases/ForgeLogEvent",
          label: "ForgeLogEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/ForgeRejectionCategory",
          label: "ForgeRejectionCategory"
        },
        {
          type: "doc",
          id: "api/type-aliases/ForgeResult",
          label: "ForgeResult"
        },
        {
          type: "doc",
          id: "api/type-aliases/FormattedPrompt",
          label: "FormattedPrompt"
        },
        {
          type: "doc",
          id: "api/type-aliases/FormattingStyle",
          label: "FormattingStyle"
        },
        {
          type: "doc",
          id: "api/type-aliases/GMICognitiveMemoryFactory",
          label: "GMICognitiveMemoryFactory"
        },
        {
          type: "doc",
          id: "api/type-aliases/GraphCondition",
          label: "GraphCondition"
        },
        {
          type: "doc",
          id: "api/type-aliases/GraphConditionExpr",
          label: "GraphConditionExpr"
        },
        {
          type: "doc",
          id: "api/type-aliases/GraphConditionFn",
          label: "GraphConditionFn"
        },
        {
          type: "doc",
          id: "api/type-aliases/GraphEvent",
          label: "GraphEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/GraphMemoryScope",
          label: "GraphMemoryScope"
        },
        {
          type: "doc",
          id: "api/type-aliases/GraphPatch",
          label: "GraphPatch"
        },
        {
          type: "doc",
          id: "api/type-aliases/GuardrailDescriptor",
          label: "GuardrailDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/HEXACOTrait",
          label: "HEXACOTrait"
        },
        {
          type: "doc",
          id: "api/type-aliases/HitlHandler",
          label: "HitlHandler"
        },
        {
          type: "doc",
          id: "api/type-aliases/HITLHandlerDescriptor",
          label: "HITLHandlerDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/HITLNotificationHandler",
          label: "HITLNotificationHandler"
        },
        {
          type: "doc",
          id: "api/type-aliases/HttpHandlerDescriptor",
          label: "HttpHandlerDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/HttpHandlerPayload",
          label: "HttpHandlerPayload"
        },
        {
          type: "doc",
          id: "api/type-aliases/HydeLlmCaller",
          label: "HydeLlmCaller"
        },
        {
          type: "doc",
          id: "api/type-aliases/IAudioAnalysis",
          label: "IAudioAnalysis"
        },
        {
          type: "doc",
          id: "api/type-aliases/IAvailableVoice",
          label: "IAvailableVoice"
        },
        {
          type: "doc",
          id: "api/type-aliases/ImageBackground",
          label: "ImageBackground"
        },
        {
          type: "doc",
          id: "api/type-aliases/ImageEditMode",
          label: "ImageEditMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/ImageModality",
          label: "ImageModality"
        },
        {
          type: "doc",
          id: "api/type-aliases/ImageOutputFormat",
          label: "ImageOutputFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/ImageProviderFactory",
          label: "ImageProviderFactory"
        },
        {
          type: "doc",
          id: "api/type-aliases/ImageProviderId",
          label: "ImageProviderId"
        },
        {
          type: "doc",
          id: "api/type-aliases/ImageResponseFormat",
          label: "ImageResponseFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/InboundMessageHandler",
          label: "InboundMessageHandler"
        },
        {
          type: "doc",
          id: "api/type-aliases/InboundPolicy",
          label: "InboundPolicy"
        },
        {
          type: "doc",
          id: "api/type-aliases/InstallationStatus",
          label: "InstallationStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/ISttOptions",
          label: "ISttOptions"
        },
        {
          type: "doc",
          id: "api/type-aliases/ISttProvider",
          label: "ISttProvider"
        },
        {
          type: "doc",
          id: "api/type-aliases/ISttRequestOptions",
          label: "ISttRequestOptions"
        },
        {
          type: "doc",
          id: "api/type-aliases/ItemStatus",
          label: "ItemStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/ItemVisibility",
          label: "ItemVisibility"
        },
        {
          type: "doc",
          id: "api/type-aliases/ITranscriptionResult",
          label: "ITranscriptionResult"
        },
        {
          type: "doc",
          id: "api/type-aliases/ITranscriptionSegment",
          label: "ITranscriptionSegment"
        },
        {
          type: "doc",
          id: "api/type-aliases/ITranscriptionSegmentWord",
          label: "ITranscriptionSegmentWord"
        },
        {
          type: "doc",
          id: "api/type-aliases/ITtsOptions",
          label: "ITtsOptions"
        },
        {
          type: "doc",
          id: "api/type-aliases/ITtsProvider",
          label: "ITtsProvider"
        },
        {
          type: "doc",
          id: "api/type-aliases/ITtsResult",
          label: "ITtsResult"
        },
        {
          type: "doc",
          id: "api/type-aliases/JSONSchemaObject",
          label: "JSONSchemaObject"
        },
        {
          type: "doc",
          id: "api/type-aliases/JSONSchemaStringFormat",
          label: "JSONSchemaStringFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/JSONSchemaType",
          label: "JSONSchemaType"
        },
        {
          type: "doc",
          id: "api/type-aliases/JudgeGenerateText",
          label: "JudgeGenerateText"
        },
        {
          type: "doc",
          id: "api/type-aliases/LifecycleAction",
          label: "LifecycleAction"
        },
        {
          type: "doc",
          id: "api/type-aliases/LlmCallerFn",
          label: "LlmCallerFn"
        },
        {
          type: "doc",
          id: "api/type-aliases/LongTermMemoryRecallProfile",
          label: "LongTermMemoryRecallProfile"
        },
        {
          type: "doc",
          id: "api/type-aliases/LongTermMemoryScope",
          label: "LongTermMemoryScope"
        },
        {
          type: "doc",
          id: "api/type-aliases/LoopEvent",
          label: "LoopEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/MarketplaceItemType",
          label: "MarketplaceItemType"
        },
        {
          type: "doc",
          id: "api/type-aliases/MediaStreamIncoming",
          label: "MediaStreamIncoming"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryConsistencyMode",
          label: "MemoryConsistencyMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryEdgeType",
          label: "MemoryEdgeType"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryProviderDescriptor",
          label: "MemoryProviderDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryRetrievalProfile",
          label: "MemoryRetrievalProfile"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryScope",
          label: "MemoryScope"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemorySourceType",
          label: "MemorySourceType"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryTraceType",
          label: "MemoryTraceType"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryType",
          label: "MemoryType"
        },
        {
          type: "doc",
          id: "api/type-aliases/MemoryTypeFilter",
          label: "MemoryTypeFilter"
        },
        {
          type: "doc",
          id: "api/type-aliases/MessageContentBlock",
          label: "MessageContentBlock"
        },
        {
          type: "doc",
          id: "api/type-aliases/MessageEvent",
          label: "MessageEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/MessagingChannelDescriptor",
          label: "MessagingChannelDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/MetadataFilter",
          label: "MetadataFilter"
        },
        {
          type: "doc",
          id: "api/type-aliases/MetadataScalarValue",
          label: "MetadataScalarValue"
        },
        {
          type: "doc",
          id: "api/type-aliases/MetadataValue",
          label: "MetadataValue"
        },
        {
          type: "doc",
          id: "api/type-aliases/MetricType",
          label: "MetricType"
        },
        {
          type: "doc",
          id: "api/type-aliases/MissionEvent",
          label: "MissionEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/MissionExpansionTrigger",
          label: "MissionExpansionTrigger"
        },
        {
          type: "doc",
          id: "api/type-aliases/ModalityFilter",
          label: "ModalityFilter"
        },
        {
          type: "doc",
          id: "api/type-aliases/NamedExternalToolRegistryEntry",
          label: "NamedExternalToolRegistryEntry"
        },
        {
          type: "doc",
          id: "api/type-aliases/Neo4jRecord",
          label: "Neo4jRecord"
        },
        {
          type: "doc",
          id: "api/type-aliases/NodeExecutionMode",
          label: "NodeExecutionMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/NodeExecutorConfig",
          label: "NodeExecutorConfig"
        },
        {
          type: "doc",
          id: "api/type-aliases/NormalizedCallEvent",
          label: "NormalizedCallEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/NormalizedExternalToolRegistry",
          label: "NormalizedExternalToolRegistry"
        },
        {
          type: "doc",
          id: "api/type-aliases/ParsedSkillFrontmatter",
          label: "ParsedSkillFrontmatter"
        },
        {
          type: "doc",
          id: "api/type-aliases/PendingExternalToolHandler",
          label: "PendingExternalToolHandler"
        },
        {
          type: "doc",
          id: "api/type-aliases/PersonaDescriptor",
          label: "PersonaDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/PlanActionType",
          label: "PlanActionType"
        },
        {
          type: "doc",
          id: "api/type-aliases/PlanningStrategy",
          label: "PlanningStrategy"
        },
        {
          type: "doc",
          id: "api/type-aliases/PlanningStrategyDescriptor",
          label: "PlanningStrategyDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/PlanStepStatus",
          label: "PlanStepStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/PortableToolImplementation",
          label: "PortableToolImplementation"
        },
        {
          type: "doc",
          id: "api/type-aliases/PromptAwareExternalToolRegistryEntry",
          label: "PromptAwareExternalToolRegistryEntry"
        },
        {
          type: "doc",
          id: "api/type-aliases/PromptTemplateFunction",
          label: "PromptTemplateFunction"
        },
        {
          type: "doc",
          id: "api/type-aliases/ProofLevel",
          label: "ProofLevel"
        },
        {
          type: "doc",
          id: "api/type-aliases/ProspectiveTriggerType",
          label: "ProspectiveTriggerType"
        },
        {
          type: "doc",
          id: "api/type-aliases/ProvenanceEventType",
          label: "ProvenanceEventType"
        },
        {
          type: "doc",
          id: "api/type-aliases/ProviderConfig",
          label: "ProviderConfig"
        },
        {
          type: "doc",
          id: "api/type-aliases/ProviderStrategyName",
          label: "ProviderStrategyName"
        },
        {
          type: "doc",
          id: "api/type-aliases/QueryRouterEmbeddingStatus",
          label: "QueryRouterEmbeddingStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/QueryRouterEventUnion",
          label: "QueryRouterEventUnion"
        },
        {
          type: "doc",
          id: "api/type-aliases/QueryRouterRetrievalMode",
          label: "QueryRouterRetrievalMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/QueryRouterRuntimeMode",
          label: "QueryRouterRuntimeMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/QueryRouterToggleableRuntimeMode",
          label: "QueryRouterToggleableRuntimeMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/QueryTier",
          label: "QueryTier"
        },
        {
          type: "doc",
          id: "api/type-aliases/RateLimitInfo",
          label: "RateLimitInfo"
        },
        {
          type: "doc",
          id: "api/type-aliases/ReducerFn",
          label: "ReducerFn"
        },
        {
          type: "doc",
          id: "api/type-aliases/ReflectionPatternType",
          label: "ReflectionPatternType"
        },
        {
          type: "doc",
          id: "api/type-aliases/RegistrySourceType",
          label: "RegistrySourceType"
        },
        {
          type: "doc",
          id: "api/type-aliases/RelationId",
          label: "RelationId"
        },
        {
          type: "doc",
          id: "api/type-aliases/RelationType",
          label: "RelationType"
        },
        {
          type: "doc",
          id: "api/type-aliases/RollingSummaryMemoryCategory",
          label: "RollingSummaryMemoryCategory"
        },
        {
          type: "doc",
          id: "api/type-aliases/SandboxAPI",
          label: "SandboxAPI"
        },
        {
          type: "doc",
          id: "api/type-aliases/SandboxLanguage",
          label: "SandboxLanguage"
        },
        {
          type: "doc",
          id: "api/type-aliases/ScorerFunction",
          label: "ScorerFunction"
        },
        {
          type: "doc",
          id: "api/type-aliases/SessionSummarizerInvoker",
          label: "SessionSummarizerInvoker"
        },
        {
          type: "doc",
          id: "api/type-aliases/SetupStatus",
          label: "SetupStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/SignalName",
          label: "SignalName"
        },
        {
          type: "doc",
          id: "api/type-aliases/SkillInstallKind",
          label: "SkillInstallKind"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpanAttributes",
          label: "SpanAttributes"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpanKind",
          label: "SpanKind"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpanStatus",
          label: "SpanStatus"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpeechProviderKind",
          label: "SpeechProviderKind"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpeechResponseFormat",
          label: "SpeechResponseFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpeechSessionBoundaryReason",
          label: "SpeechSessionBoundaryReason"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpeechSessionMode",
          label: "SpeechSessionMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpeechSessionState",
          label: "SpeechSessionState"
        },
        {
          type: "doc",
          id: "api/type-aliases/SpeechSynthesisOutputFormat",
          label: "SpeechSynthesisOutputFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/StoragePolicyMode",
          label: "StoragePolicyMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/StreamId",
          label: "StreamId"
        },
        {
          type: "doc",
          id: "api/type-aliases/StreamPart",
          label: "StreamPart"
        },
        {
          type: "doc",
          id: "api/type-aliases/StructuredOutputStrategy",
          label: "StructuredOutputStrategy"
        },
        {
          type: "doc",
          id: "api/type-aliases/SttProviderDescriptor",
          label: "SttProviderDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/SttResponseFormat",
          label: "SttResponseFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/StuckReason",
          label: "StuckReason"
        },
        {
          type: "doc",
          id: "api/type-aliases/TaskOutcomeKpiWindowEntry",
          label: "TaskOutcomeKpiWindowEntry"
        },
        {
          type: "doc",
          id: "api/type-aliases/TaskOutcomeTelemetryScope",
          label: "TaskOutcomeTelemetryScope"
        },
        {
          type: "doc",
          id: "api/type-aliases/TaskType",
          label: "TaskType"
        },
        {
          type: "doc",
          id: "api/type-aliases/TelephonyTtsProvider",
          label: "TelephonyTtsProvider"
        },
        {
          type: "doc",
          id: "api/type-aliases/TenantRoutingMode",
          label: "TenantRoutingMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/TokenEstimator",
          label: "TokenEstimator"
        },
        {
          type: "doc",
          id: "api/type-aliases/ToolDefinitionMap",
          label: "ToolDefinitionMap"
        },
        {
          type: "doc",
          id: "api/type-aliases/ToolDescriptor",
          label: "ToolDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/ToolFailureMode",
          label: "ToolFailureMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/ToolImplementation",
          label: "ToolImplementation"
        },
        {
          type: "doc",
          id: "api/type-aliases/ToolResultPayload",
          label: "ToolResultPayload"
        },
        {
          type: "doc",
          id: "api/type-aliases/ToolSelectionMode",
          label: "ToolSelectionMode"
        },
        {
          type: "doc",
          id: "api/type-aliases/ToolTier",
          label: "ToolTier"
        },
        {
          type: "doc",
          id: "api/type-aliases/TranslationDomain",
          label: "TranslationDomain"
        },
        {
          type: "doc",
          id: "api/type-aliases/TransparencyLevel",
          label: "TransparencyLevel"
        },
        {
          type: "doc",
          id: "api/type-aliases/TrustCapability",
          label: "TrustCapability"
        },
        {
          type: "doc",
          id: "api/type-aliases/TtsProviderDescriptor",
          label: "TtsProviderDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/TypedExtractionFact",
          label: "TypedExtractionFact"
        },
        {
          type: "doc",
          id: "api/type-aliases/TypedExtractionOutput",
          label: "TypedExtractionOutput"
        },
        {
          type: "doc",
          id: "api/type-aliases/UnifiedRetrieverEvent",
          label: "UnifiedRetrieverEvent"
        },
        {
          type: "doc",
          id: "api/type-aliases/UsageSummary",
          label: "UsageSummary"
        },
        {
          type: "doc",
          id: "api/type-aliases/VadProviderDescriptor",
          label: "VadProviderDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/VectorLike",
          label: "VectorLike"
        },
        {
          type: "doc",
          id: "api/type-aliases/VideoAspectRatio",
          label: "VideoAspectRatio"
        },
        {
          type: "doc",
          id: "api/type-aliases/VideoOutputFormat",
          label: "VideoOutputFormat"
        },
        {
          type: "doc",
          id: "api/type-aliases/VideoProviderFactory",
          label: "VideoProviderFactory"
        },
        {
          type: "doc",
          id: "api/type-aliases/VideoProviderId",
          label: "VideoProviderId"
        },
        {
          type: "doc",
          id: "api/type-aliases/VideoResolution",
          label: "VideoResolution"
        },
        {
          type: "doc",
          id: "api/type-aliases/VisionContentCategory",
          label: "VisionContentCategory"
        },
        {
          type: "doc",
          id: "api/type-aliases/VisionStrategy",
          label: "VisionStrategy"
        },
        {
          type: "doc",
          id: "api/type-aliases/VisionTier",
          label: "VisionTier"
        },
        {
          type: "doc",
          id: "api/type-aliases/VoiceProviderName",
          label: "VoiceProviderName"
        },
        {
          type: "doc",
          id: "api/type-aliases/WakeWordProviderDescriptor",
          label: "WakeWordProviderDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/WorkflowDescriptor",
          label: "WorkflowDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/WorkflowExecutorDescriptor",
          label: "WorkflowExecutorDescriptor"
        },
        {
          type: "doc",
          id: "api/type-aliases/WorkflowExtensionExecutor",
          label: "WorkflowExtensionExecutor"
        },
        {
          type: "doc",
          id: "api/type-aliases/WorkflowTaskExecutorType",
          label: "WorkflowTaskExecutorType"
        },
        {
          type: "doc",
          id: "api/variables/AGENTOS_PENDING_EXTERNAL_TOOL_REQUEST_METADATA_KEY",
          label: "AGENTOS_PENDING_EXTERNAL_TOOL_REQUEST_METADATA_KEY"
        },
        {
          type: "doc",
          id: "api/variables/BANK_IDS",
          label: "BANK_IDS"
        },
        {
          type: "doc",
          id: "api/variables/BUILT_IN_PERSONAS",
          label: "BUILT_IN_PERSONAS"
        },
        {
          type: "doc",
          id: "api/variables/CONVERSATION_STATES",
          label: "CONVERSATION_STATES"
        },
        {
          type: "doc",
          id: "api/variables/CRITERIA_PRESETS",
          label: "CRITERIA_PRESETS"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_BUDGET_ALLOCATION",
          label: "DEFAULT_BUDGET_ALLOCATION"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_DECAY_CONFIG",
          label: "DEFAULT_DECAY_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_EDGE_MULTIPLIERS",
          label: "DEFAULT_EDGE_MULTIPLIERS"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_EMERGENT_CONFIG",
          label: "DEFAULT_EMERGENT_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_ENCODING_CONFIG",
          label: "DEFAULT_ENCODING_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_HYDE_CONFIG",
          label: "DEFAULT_HYDE_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_INFINITE_CONTEXT_CONFIG",
          label: "DEFAULT_INFINITE_CONTEXT_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_LONG_TERM_MEMORY_POLICY",
          label: "DEFAULT_LONG_TERM_MEMORY_POLICY"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_MECHANISMS_CONFIG",
          label: "DEFAULT_MECHANISMS_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_MEMORY_RETRIEVAL_POLICY",
          label: "DEFAULT_MEMORY_RETRIEVAL_POLICY"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_PERSONA_DRIFT_CONFIG",
          label: "DEFAULT_PERSONA_DRIFT_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_RATE_LIMIT_BANNER_THRESHOLDS",
          label: "DEFAULT_RATE_LIMIT_BANNER_THRESHOLDS"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_REGISTRY_CONFIG",
          label: "DEFAULT_REGISTRY_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_SCORING_WEIGHTS",
          label: "DEFAULT_SCORING_WEIGHTS"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_SELF_IMPROVEMENT_CONFIG",
          label: "DEFAULT_SELF_IMPROVEMENT_CONFIG"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_SNAPSHOT_VERSION",
          label: "DEFAULT_SNAPSHOT_VERSION"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_THRESHOLDS",
          label: "DEFAULT_THRESHOLDS"
        },
        {
          type: "doc",
          id: "api/variables/DEFAULT_TRUST_POLICY_BY_SOURCE",
          label: "DEFAULT_TRUST_POLICY_BY_SOURCE"
        },
        {
          type: "doc",
          id: "api/variables/EDGE_KINDS",
          label: "EDGE_KINDS"
        },
        {
          type: "doc",
          id: "api/variables/EMERGENT_TOOL_PACKAGE_SCHEMA_VERSION",
          label: "EMERGENT_TOOL_PACKAGE_SCHEMA_VERSION"
        },
        {
          type: "doc",
          id: "api/variables/END",
          label: "END"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_BARGEIN_HANDLER",
          label: "EXTENSION_KIND_BARGEIN_HANDLER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_COMM_CHANNEL",
          label: "EXTENSION_KIND_COMM_CHANNEL"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_DIARIZATION",
          label: "EXTENSION_KIND_DIARIZATION"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_ENDPOINT_DETECTOR",
          label: "EXTENSION_KIND_ENDPOINT_DETECTOR"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_GUARDRAIL",
          label: "EXTENSION_KIND_GUARDRAIL"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_HITL_HANDLER",
          label: "EXTENSION_KIND_HITL_HANDLER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_HTTP_HANDLER",
          label: "EXTENSION_KIND_HTTP_HANDLER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_MEMORY_PROVIDER",
          label: "EXTENSION_KIND_MEMORY_PROVIDER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_MESSAGING_CHANNEL",
          label: "EXTENSION_KIND_MESSAGING_CHANNEL"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_PERSONA",
          label: "EXTENSION_KIND_PERSONA"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_PLANNING_STRATEGY",
          label: "EXTENSION_KIND_PLANNING_STRATEGY"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_PROVENANCE",
          label: "EXTENSION_KIND_PROVENANCE"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_RESPONSE_PROCESSOR",
          label: "EXTENSION_KIND_RESPONSE_PROCESSOR"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_STREAMING_STT",
          label: "EXTENSION_KIND_STREAMING_STT"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_STREAMING_TTS",
          label: "EXTENSION_KIND_STREAMING_TTS"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_STT_PROVIDER",
          label: "EXTENSION_KIND_STT_PROVIDER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_TOOL",
          label: "EXTENSION_KIND_TOOL"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_TTS_PROVIDER",
          label: "EXTENSION_KIND_TTS_PROVIDER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_VAD_PROVIDER",
          label: "EXTENSION_KIND_VAD_PROVIDER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_WAKE_WORD_PROVIDER",
          label: "EXTENSION_KIND_WAKE_WORD_PROVIDER"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_WORKFLOW",
          label: "EXTENSION_KIND_WORKFLOW"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_KIND_WORKFLOW_EXECUTOR",
          label: "EXTENSION_KIND_WORKFLOW_EXECUTOR"
        },
        {
          type: "doc",
          id: "api/variables/EXTENSION_SECRET_DEFINITIONS",
          label: "EXTENSION_SECRET_DEFINITIONS"
        },
        {
          type: "doc",
          id: "api/variables/hitl",
          label: "hitl"
        },
        {
          type: "doc",
          id: "api/variables/LONG_TERM_MEMORY_POLICY_METADATA_KEY",
          label: "LONG_TERM_MEMORY_POLICY_METADATA_KEY"
        },
        {
          type: "doc",
          id: "api/variables/ORGANIZATION_ID_METADATA_KEY",
          label: "ORGANIZATION_ID_METADATA_KEY"
        },
        {
          type: "doc",
          id: "api/variables/PREDICATE_SCHEMA",
          label: "PREDICATE_SCHEMA"
        },
        {
          type: "doc",
          id: "api/variables/profiles",
          label: "profiles"
        },
        {
          type: "doc",
          id: "api/variables/PROVIDER_DEFAULTS",
          label: "PROVIDER_DEFAULTS"
        },
        {
          type: "doc",
          id: "api/variables/REFLECTOR_PROMPT_HASH",
          label: "REFLECTOR_PROMPT_HASH"
        },
        {
          type: "doc",
          id: "api/variables/SemanticAttributes",
          label: "SemanticAttributes"
        },
        {
          type: "doc",
          id: "api/variables/SKILL_COMMAND_DESCRIPTION_MAX_LENGTH",
          label: "SKILL_COMMAND_DESCRIPTION_MAX_LENGTH"
        },
        {
          type: "doc",
          id: "api/variables/SKILL_COMMAND_FALLBACK",
          label: "SKILL_COMMAND_FALLBACK"
        },
        {
          type: "doc",
          id: "api/variables/SKILL_COMMAND_MAX_LENGTH",
          label: "SKILL_COMMAND_MAX_LENGTH"
        },
        {
          type: "doc",
          id: "api/variables/SPEECH_PROVIDER_CATALOG",
          label: "SPEECH_PROVIDER_CATALOG"
        },
        {
          type: "doc",
          id: "api/variables/START",
          label: "START"
        },
        {
          type: "doc",
          id: "api/variables/STATE_ORDER",
          label: "STATE_ORDER"
        },
        {
          type: "doc",
          id: "api/variables/TERMINAL_CALL_STATES",
          label: "TERMINAL_CALL_STATES"
        },
        {
          type: "doc",
          id: "api/variables/TYPED_EXTRACTION_SYSTEM_PROMPT",
          label: "TYPED_EXTRACTION_SYSTEM_PROMPT"
        },
        {
          type: "doc",
          id: "api/variables/TypedExtractionFactSchema",
          label: "TypedExtractionFactSchema"
        },
        {
          type: "doc",
          id: "api/variables/TypedExtractionSchema",
          label: "TypedExtractionSchema"
        },
        {
          type: "doc",
          id: "api/functions/adaptTools",
          label: "adaptTools"
        },
        {
          type: "doc",
          id: "api/functions/adaptToolsToMap",
          label: "adaptToolsToMap"
        },
        {
          type: "doc",
          id: "api/functions/analyzePersonaDrift",
          label: "analyzePersonaDrift"
        },
        {
          type: "doc",
          id: "api/functions/analyzeVideo",
          label: "analyzeVideo"
        },
        {
          type: "doc",
          id: "api/functions/assembleMemoryContext",
          label: "assembleMemoryContext"
        },
        {
          type: "doc",
          id: "api/functions/autoDetectProvider",
          label: "autoDetectProvider"
        },
        {
          type: "doc",
          id: "api/functions/blobToEmbedding",
          label: "blobToEmbedding"
        },
        {
          type: "doc",
          id: "api/functions/blobToFloat32",
          label: "blobToFloat32"
        },
        {
          type: "doc",
          id: "api/functions/bufferToBlobPart",
          label: "bufferToBlobPart"
        },
        {
          type: "doc",
          id: "api/functions/buildCapabilityYaml",
          label: "buildCapabilityYaml"
        },
        {
          type: "doc",
          id: "api/functions/buildDefaultPlan",
          label: "buildDefaultPlan"
        },
        {
          type: "doc",
          id: "api/functions/buildEmergentToolPackage",
          label: "buildEmergentToolPackage"
        },
        {
          type: "doc",
          id: "api/functions/buildEmotionalContext",
          label: "buildEmotionalContext"
        },
        {
          type: "doc",
          id: "api/functions/buildExtractionUserPrompt",
          label: "buildExtractionUserPrompt"
        },
        {
          type: "doc",
          id: "api/functions/buildFallbackChain",
          label: "buildFallbackChain"
        },
        {
          type: "doc",
          id: "api/functions/buildLlmCaller",
          label: "buildLlmCaller"
        },
        {
          type: "doc",
          id: "api/functions/buildPendingExternalToolExecutionContext",
          label: "buildPendingExternalToolExecutionContext"
        },
        {
          type: "doc",
          id: "api/functions/buildPolicyAwareFallbackChain",
          label: "buildPolicyAwareFallbackChain"
        },
        {
          type: "doc",
          id: "api/functions/buildRegisteredExternalToolExecutionContext",
          label: "buildRegisteredExternalToolExecutionContext"
        },
        {
          type: "doc",
          id: "api/functions/buildRetrievalPlanFromPolicy",
          label: "buildRetrievalPlanFromPolicy"
        },
        {
          type: "doc",
          id: "api/functions/buildScopedExternalToolContextParts",
          label: "buildScopedExternalToolContextParts"
        },
        {
          type: "doc",
          id: "api/functions/buildSplitCallers",
          label: "buildSplitCallers"
        },
        {
          type: "doc",
          id: "api/functions/buildStandaloneMemoryPersonaScopeId",
          label: "buildStandaloneMemoryPersonaScopeId"
        },
        {
          type: "doc",
          id: "api/functions/calculateRemainingPercentage",
          label: "calculateRemainingPercentage"
        },
        {
          type: "doc",
          id: "api/functions/canonicalizeSubject",
          label: "canonicalizeSubject"
        },
        {
          type: "doc",
          id: "api/functions/canUseFor",
          label: "canUseFor"
        },
        {
          type: "doc",
          id: "api/functions/checkBinaryRequirements",
          label: "checkBinaryRequirements"
        },
        {
          type: "doc",
          id: "api/functions/classifyForgeRejection",
          label: "classifyForgeRejection"
        },
        {
          type: "doc",
          id: "api/functions/clearDefaultProvider",
          label: "clearDefaultProvider"
        },
        {
          type: "doc",
          id: "api/functions/clearProviderPriority",
          label: "clearProviderPriority"
        },
        {
          type: "doc",
          id: "api/functions/clearRecordedAgentOSUsage",
          label: "clearRecordedAgentOSUsage"
        },
        {
          type: "doc",
          id: "api/functions/computeAttentionMultiplier",
          label: "computeAttentionMultiplier"
        },
        {
          type: "doc",
          id: "api/functions/computeCurrentStrength",
          label: "computeCurrentStrength"
        },
        {
          type: "doc",
          id: "api/functions/computeEmotionalCongruence",
          label: "computeEmotionalCongruence"
        },
        {
          type: "doc",
          id: "api/functions/computeEncodingStrength",
          label: "computeEncodingStrength"
        },
        {
          type: "doc",
          id: "api/functions/computeEncodingWeights",
          label: "computeEncodingWeights"
        },
        {
          type: "doc",
          id: "api/functions/computeInterference",
          label: "computeInterference"
        },
        {
          type: "doc",
          id: "api/functions/computeRecencyBoost",
          label: "computeRecencyBoost"
        },
        {
          type: "doc",
          id: "api/functions/concatFloat32AudioFrames",
          label: "concatFloat32AudioFrames"
        },
        {
          type: "doc",
          id: "api/functions/configureAgentOSObservability",
          label: "configureAgentOSObservability"
        },
        {
          type: "doc",
          id: "api/functions/convertMulawToPcm16",
          label: "convertMulawToPcm16"
        },
        {
          type: "doc",
          id: "api/functions/convertPcmToMulaw8k",
          label: "convertPcmToMulaw8k"
        },
        {
          type: "doc",
          id: "api/functions/cosineSimilarity",
          label: "cosineSimilarity"
        },
        {
          type: "doc",
          id: "api/functions/createAnchorProvider",
          label: "createAnchorProvider"
        },
        {
          type: "doc",
          id: "api/functions/createAudioProvider",
          label: "createAudioProvider"
        },
        {
          type: "doc",
          id: "api/functions/createCognitiveMemoryDescriptor",
          label: "createCognitiveMemoryDescriptor"
        },
        {
          type: "doc",
          id: "api/functions/createDoclingLoader",
          label: "createDoclingLoader"
        },
        {
          type: "doc",
          id: "api/functions/createExternalToolProxyTool",
          label: "createExternalToolProxyTool"
        },
        {
          type: "doc",
          id: "api/functions/createFeatureDetector",
          label: "createFeatureDetector"
        },
        {
          type: "doc",
          id: "api/functions/createGuardrailBlockedStream",
          label: "createGuardrailBlockedStream"
        },
        {
          type: "doc",
          id: "api/functions/createImageProvider",
          label: "createImageProvider"
        },
        {
          type: "doc",
          id: "api/functions/createLogger",
          label: "createLogger"
        },
        {
          type: "doc",
          id: "api/functions/createMemoryToolDescriptors",
          label: "createMemoryToolDescriptors"
        },
        {
          type: "doc",
          id: "api/functions/createMemoryToolsPack",
          label: "createMemoryToolsPack"
        },
        {
          type: "doc",
          id: "api/functions/createMissionExpansionHandler",
          label: "createMissionExpansionHandler"
        },
        {
          type: "doc",
          id: "api/functions/createMultimodalIndexerFromResolver",
          label: "createMultimodalIndexerFromResolver"
        },
        {
          type: "doc",
          id: "api/functions/createOcrPdfLoader",
          label: "createOcrPdfLoader"
        },
        {
          type: "doc",
          id: "api/functions/createProvenanceHooks",
          label: "createProvenanceHooks"
        },
        {
          type: "doc",
          id: "api/functions/createRegisteredExternalToolHandler",
          label: "createRegisteredExternalToolHandler"
        },
        {
          type: "doc",
          id: "api/functions/createSpeechRuntime",
          label: "createSpeechRuntime"
        },
        {
          type: "doc",
          id: "api/functions/createSpeechRuntimeFromEnv",
          label: "createSpeechRuntimeFromEnv"
        },
        {
          type: "doc",
          id: "api/functions/createStandaloneMemoryDescriptor",
          label: "createStandaloneMemoryDescriptor"
        },
        {
          type: "doc",
          id: "api/functions/createStandaloneMemoryLongTermRetriever",
          label: "createStandaloneMemoryLongTermRetriever"
        },
        {
          type: "doc",
          id: "api/functions/createStandaloneMemoryRollingSummarySink",
          label: "createStandaloneMemoryRollingSummarySink"
        },
        {
          type: "doc",
          id: "api/functions/createTestAgentOSConfig",
          label: "createTestAgentOSConfig"
        },
        {
          type: "doc",
          id: "api/functions/createVideoProvider",
          label: "createVideoProvider"
        },
        {
          type: "doc",
          id: "api/functions/createVisionPipeline",
          label: "createVisionPipeline"
        },
        {
          type: "doc",
          id: "api/functions/detectPartiallyRetrieved",
          label: "detectPartiallyRetrieved"
        },
        {
          type: "doc",
          id: "api/functions/detectScenes",
          label: "detectScenes"
        },
        {
          type: "doc",
          id: "api/functions/dotProduct",
          label: "dotProduct"
        },
        {
          type: "doc",
          id: "api/functions/editImage",
          label: "editImage"
        },
        {
          type: "doc",
          id: "api/functions/embeddingToBlob",
          label: "embeddingToBlob"
        },
        {
          type: "doc",
          id: "api/functions/embedText",
          label: "embedText"
        },
        {
          type: "doc",
          id: "api/functions/emptyForgeStats",
          label: "emptyForgeStats"
        },
        {
          type: "doc",
          id: "api/functions/encodeFloat32ToWav",
          label: "encodeFloat32ToWav"
        },
        {
          type: "doc",
          id: "api/functions/escapeXml",
          label: "escapeXml"
        },
        {
          type: "doc",
          id: "api/functions/euclideanDistance",
          label: "euclideanDistance"
        },
        {
          type: "doc",
          id: "api/functions/evaluateCrossAgentGuardrails",
          label: "evaluateCrossAgentGuardrails"
        },
        {
          type: "doc",
          id: "api/functions/evaluateInputGuardrails",
          label: "evaluateInputGuardrails"
        },
        {
          type: "doc",
          id: "api/functions/executeExternalToolFromRegistry",
          label: "executeExternalToolFromRegistry"
        },
        {
          type: "doc",
          id: "api/functions/executePendingExternalToolCall",
          label: "executePendingExternalToolCall"
        },
        {
          type: "doc",
          id: "api/functions/executePendingExternalToolCalls",
          label: "executePendingExternalToolCalls"
        },
        {
          type: "doc",
          id: "api/functions/exportAgentConfig",
          label: "exportAgentConfig"
        },
        {
          type: "doc",
          id: "api/functions/exportAgentConfigJSON",
          label: "exportAgentConfigJSON"
        },
        {
          type: "doc",
          id: "api/functions/exportAgentConfigYAML",
          label: "exportAgentConfigYAML"
        },
        {
          type: "doc",
          id: "api/functions/exportToolAsSkill",
          label: "exportToolAsSkill"
        },
        {
          type: "doc",
          id: "api/functions/exportToolAsSkillPack",
          label: "exportToolAsSkillPack"
        },
        {
          type: "doc",
          id: "api/functions/extractEntities",
          label: "extractEntities"
        },
        {
          type: "doc",
          id: "api/functions/extractJson",
          label: "extractJson"
        },
        {
          type: "doc",
          id: "api/functions/extractMetadata",
          label: "extractMetadata"
        },
        {
          type: "doc",
          id: "api/functions/extractQueryEntities",
          label: "extractQueryEntities"
        },
        {
          type: "doc",
          id: "api/functions/filterByEligibility",
          label: "filterByEligibility"
        },
        {
          type: "doc",
          id: "api/functions/filterByPlatform",
          label: "filterByPlatform"
        },
        {
          type: "doc",
          id: "api/functions/filterCrossAgentGuardrails",
          label: "filterCrossAgentGuardrails"
        },
        {
          type: "doc",
          id: "api/functions/findPrunableTraces",
          label: "findPrunableTraces"
        },
        {
          type: "doc",
          id: "api/functions/findSpeechProviderCatalogEntry",
          label: "findSpeechProviderCatalogEntry"
        },
        {
          type: "doc",
          id: "api/functions/formatExternalToolsForOpenAI",
          label: "formatExternalToolsForOpenAI"
        },
        {
          type: "doc",
          id: "api/functions/formatMemoryTrace",
          label: "formatMemoryTrace"
        },
        {
          type: "doc",
          id: "api/functions/formatMemoryTraces",
          label: "formatMemoryTraces"
        },
        {
          type: "doc",
          id: "api/functions/formatToolDefinitionsForOpenAI",
          label: "formatToolDefinitionsForOpenAI"
        },
        {
          type: "doc",
          id: "api/functions/formatTraceId",
          label: "formatTraceId"
        },
        {
          type: "doc",
          id: "api/functions/formatVerifiedResponse",
          label: "formatVerifiedResponse"
        },
        {
          type: "doc",
          id: "api/functions/fourWayRrf",
          label: "fourWayRrf"
        },
        {
          type: "doc",
          id: "api/functions/generateImage",
          label: "generateImage"
        },
        {
          type: "doc",
          id: "api/functions/generateMusic",
          label: "generateMusic"
        },
        {
          type: "doc",
          id: "api/functions/generateObject",
          label: "generateObject"
        },
        {
          type: "doc",
          id: "api/functions/generateSFX",
          label: "generateSFX"
        },
        {
          type: "doc",
          id: "api/functions/generateText",
          label: "generateText"
        },
        {
          type: "doc",
          id: "api/functions/generateVideo",
          label: "generateVideo"
        },
        {
          type: "doc",
          id: "api/functions/getActiveSpanContext",
          label: "getActiveSpanContext"
        },
        {
          type: "doc",
          id: "api/functions/getActiveTraceMetadata",
          label: "getActiveTraceMetadata"
        },
        {
          type: "doc",
          id: "api/functions/getAgentOSObservabilityState",
          label: "getAgentOSObservabilityState"
        },
        {
          type: "doc",
          id: "api/functions/getBuiltInPersona",
          label: "getBuiltInPersona"
        },
        {
          type: "doc",
          id: "api/functions/getCandidateLimit",
          label: "getCandidateLimit"
        },
        {
          type: "doc",
          id: "api/functions/getDefaultAgentOSUsageLedgerPath",
          label: "getDefaultAgentOSUsageLedgerPath"
        },
        {
          type: "doc",
          id: "api/functions/getDefaultProvider",
          label: "getDefaultProvider"
        },
        {
          type: "doc",
          id: "api/functions/getDefaultSpeechProviderId",
          label: "getDefaultSpeechProviderId"
        },
        {
          type: "doc",
          id: "api/functions/getImageProviderOptions",
          label: "getImageProviderOptions"
        },
        {
          type: "doc",
          id: "api/functions/getProvenanceDropSchema",
          label: "getProvenanceDropSchema"
        },
        {
          type: "doc",
          id: "api/functions/getProvenanceSchema",
          label: "getProvenanceSchema"
        },
        {
          type: "doc",
          id: "api/functions/getProviderPriority",
          label: "getProviderPriority"
        },
        {
          type: "doc",
          id: "api/functions/getRateLimitBannerSeverity",
          label: "getRateLimitBannerSeverity"
        },
        {
          type: "doc",
          id: "api/functions/getRecordedAgentOSUsage",
          label: "getRecordedAgentOSUsage"
        },
        {
          type: "doc",
          id: "api/functions/getSecretDefinition",
          label: "getSecretDefinition"
        },
        {
          type: "doc",
          id: "api/functions/getSpeechProviderCatalog",
          label: "getSpeechProviderCatalog"
        },
        {
          type: "doc",
          id: "api/functions/getSpeechProviderKinds",
          label: "getSpeechProviderKinds"
        },
        {
          type: "doc",
          id: "api/functions/gmiNode",
          label: "gmiNode"
        },
        {
          type: "doc",
          id: "api/functions/guardrailNode",
          label: "guardrailNode"
        },
        {
          type: "doc",
          id: "api/functions/hasAnyLongTermMemoryScope",
          label: "hasAnyLongTermMemoryScope"
        },
        {
          type: "doc",
          id: "api/functions/hasAudioProviderFactory",
          label: "hasAudioProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/hashPredicate",
          label: "hashPredicate"
        },
        {
          type: "doc",
          id: "api/functions/hashSubject",
          label: "hashSubject"
        },
        {
          type: "doc",
          id: "api/functions/hasImageProviderFactory",
          label: "hasImageProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/hasVideoProviderFactory",
          label: "hasVideoProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/humanNode",
          label: "humanNode"
        },
        {
          type: "doc",
          id: "api/functions/imageToBuffer",
          label: "imageToBuffer"
        },
        {
          type: "doc",
          id: "api/functions/importAgent",
          label: "importAgent"
        },
        {
          type: "doc",
          id: "api/functions/importAgentFromJSON",
          label: "importAgentFromJSON"
        },
        {
          type: "doc",
          id: "api/functions/importAgentFromYAML",
          label: "importAgentFromYAML"
        },
        {
          type: "doc",
          id: "api/functions/inferAspectRatioFromSize",
          label: "inferAspectRatioFromSize"
        },
        {
          type: "doc",
          id: "api/functions/inferSchemaFromTestCases",
          label: "inferSchemaFromTestCases"
        },
        {
          type: "doc",
          id: "api/functions/isActionableToolCallRequestChunk",
          label: "isActionableToolCallRequestChunk"
        },
        {
          type: "doc",
          id: "api/functions/isAgentOSTracingEnabled",
          label: "isAgentOSTracingEnabled"
        },
        {
          type: "doc",
          id: "api/functions/isAuthenticatedRateLimit",
          label: "isAuthenticatedRateLimit"
        },
        {
          type: "doc",
          id: "api/functions/isBankId",
          label: "isBankId"
        },
        {
          type: "doc",
          id: "api/functions/isContentPolicyRefusal",
          label: "isContentPolicyRefusal"
        },
        {
          type: "doc",
          id: "api/functions/isCrossAgentGuardrail",
          label: "isCrossAgentGuardrail"
        },
        {
          type: "doc",
          id: "api/functions/isFlashbulbMemory",
          label: "isFlashbulbMemory"
        },
        {
          type: "doc",
          id: "api/functions/isLegacyJsonBlob",
          label: "isLegacyJsonBlob"
        },
        {
          type: "doc",
          id: "api/functions/isLikelyCodeBlock",
          label: "isLikelyCodeBlock"
        },
        {
          type: "doc",
          id: "api/functions/isPublicRateLimit",
          label: "isPublicRateLimit"
        },
        {
          type: "doc",
          id: "api/functions/isRetryableError",
          label: "isRetryableError"
        },
        {
          type: "doc",
          id: "api/functions/isSpeechProviderConfigured",
          label: "isSpeechProviderConfigured"
        },
        {
          type: "doc",
          id: "api/functions/isToolCallRequestChunk",
          label: "isToolCallRequestChunk"
        },
        {
          type: "doc",
          id: "api/functions/isValidPredicate",
          label: "isValidPredicate"
        },
        {
          type: "doc",
          id: "api/functions/judgeNode",
          label: "judgeNode"
        },
        {
          type: "doc",
          id: "api/functions/listAudioProviderFactories",
          label: "listAudioProviderFactories"
        },
        {
          type: "doc",
          id: "api/functions/listExternalToolDefinitionsForLLM",
          label: "listExternalToolDefinitionsForLLM"
        },
        {
          type: "doc",
          id: "api/functions/listImageProviderFactories",
          label: "listImageProviderFactories"
        },
        {
          type: "doc",
          id: "api/functions/listPromptAwareExternalTools",
          label: "listPromptAwareExternalTools"
        },
        {
          type: "doc",
          id: "api/functions/listVideoProviderFactories",
          label: "listVideoProviderFactories"
        },
        {
          type: "doc",
          id: "api/functions/loadSkillFromDir",
          label: "loadSkillFromDir"
        },
        {
          type: "doc",
          id: "api/functions/loadSkillsFromDir",
          label: "loadSkillsFromDir"
        },
        {
          type: "doc",
          id: "api/functions/lowerZodToJsonSchema",
          label: "lowerZodToJsonSchema"
        },
        {
          type: "doc",
          id: "api/functions/materializeEmergentToolFromPackage",
          label: "materializeEmergentToolFromPackage"
        },
        {
          type: "doc",
          id: "api/functions/mergeAdaptableTools",
          label: "mergeAdaptableTools"
        },
        {
          type: "doc",
          id: "api/functions/mergeExternalToolRegistries",
          label: "mergeExternalToolRegistries"
        },
        {
          type: "doc",
          id: "api/functions/mergeRegistryConfigs",
          label: "mergeRegistryConfigs"
        },
        {
          type: "doc",
          id: "api/functions/mission",
          label: "mission"
        },
        {
          type: "doc",
          id: "api/functions/moodCongruenceBoost",
          label: "moodCongruenceBoost"
        },
        {
          type: "doc",
          id: "api/functions/normalizeExternalToolRegistry",
          label: "normalizeExternalToolRegistry"
        },
        {
          type: "doc",
          id: "api/functions/normalizeHostLLMPolicy",
          label: "normalizeHostLLMPolicy"
        },
        {
          type: "doc",
          id: "api/functions/normalizeOptionalString",
          label: "normalizeOptionalString"
        },
        {
          type: "doc",
          id: "api/functions/normalizeOutputFormat",
          label: "normalizeOutputFormat"
        },
        {
          type: "doc",
          id: "api/functions/normalizeUsage",
          label: "normalizeUsage"
        },
        {
          type: "doc",
          id: "api/functions/parseDataUrl",
          label: "parseDataUrl"
        },
        {
          type: "doc",
          id: "api/functions/parseEmergentToolPackage",
          label: "parseEmergentToolPackage"
        },
        {
          type: "doc",
          id: "api/functions/parseGitHubUrl",
          label: "parseGitHubUrl"
        },
        {
          type: "doc",
          id: "api/functions/parseImageSize",
          label: "parseImageSize"
        },
        {
          type: "doc",
          id: "api/functions/parseModelString",
          label: "parseModelString"
        },
        {
          type: "doc",
          id: "api/functions/parseSkillFrontmatter",
          label: "parseSkillFrontmatter"
        },
        {
          type: "doc",
          id: "api/functions/partitionCodeAndProse",
          label: "partitionCodeAndProse"
        },
        {
          type: "doc",
          id: "api/functions/performOCR",
          label: "performOCR"
        },
        {
          type: "doc",
          id: "api/functions/plivoNotifyXml",
          label: "plivoNotifyXml"
        },
        {
          type: "doc",
          id: "api/functions/plivoStreamXml",
          label: "plivoStreamXml"
        },
        {
          type: "doc",
          id: "api/functions/processRequestWithExternalTools",
          label: "processRequestWithExternalTools"
        },
        {
          type: "doc",
          id: "api/functions/processRequestWithRegisteredTools",
          label: "processRequestWithRegisteredTools"
        },
        {
          type: "doc",
          id: "api/functions/rankByTemporalOverlap",
          label: "rankByTemporalOverlap"
        },
        {
          type: "doc",
          id: "api/functions/readRecordedAgentOSUsageEvents",
          label: "readRecordedAgentOSUsageEvents"
        },
        {
          type: "doc",
          id: "api/functions/reciprocalRankFusion",
          label: "reciprocalRankFusion"
        },
        {
          type: "doc",
          id: "api/functions/recombineCodeAndProse",
          label: "recombineCodeAndProse"
        },
        {
          type: "doc",
          id: "api/functions/recordAgentOSUsage",
          label: "recordAgentOSUsage"
        },
        {
          type: "doc",
          id: "api/functions/recordExceptionOnActiveSpan",
          label: "recordExceptionOnActiveSpan"
        },
        {
          type: "doc",
          id: "api/functions/registerAnchorProviderFactory",
          label: "registerAnchorProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/registerAudioProviderFactory",
          label: "registerAudioProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/registerImageProviderFactory",
          label: "registerImageProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/registerTemporaryExternalTools",
          label: "registerTemporaryExternalTools"
        },
        {
          type: "doc",
          id: "api/functions/registerVideoProviderFactory",
          label: "registerVideoProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/relativeTimeLabel",
          label: "relativeTimeLabel"
        },
        {
          type: "doc",
          id: "api/functions/resetLoggerFactory",
          label: "resetLoggerFactory"
        },
        {
          type: "doc",
          id: "api/functions/resolveAgentOSUsageLedgerPath",
          label: "resolveAgentOSUsageLedgerPath"
        },
        {
          type: "doc",
          id: "api/functions/resolveAgentWorkspaceBaseDir",
          label: "resolveAgentWorkspaceBaseDir"
        },
        {
          type: "doc",
          id: "api/functions/resolveAgentWorkspaceDir",
          label: "resolveAgentWorkspaceDir"
        },
        {
          type: "doc",
          id: "api/functions/resolveDefaultSkillsDirs",
          label: "resolveDefaultSkillsDirs"
        },
        {
          type: "doc",
          id: "api/functions/resolveHydeConfig",
          label: "resolveHydeConfig"
        },
        {
          type: "doc",
          id: "api/functions/resolveLongTermMemoryPolicy",
          label: "resolveLongTermMemoryPolicy"
        },
        {
          type: "doc",
          id: "api/functions/resolveMechanismsConfig",
          label: "resolveMechanismsConfig"
        },
        {
          type: "doc",
          id: "api/functions/resolveMemoryRetrievalPolicy",
          label: "resolveMemoryRetrievalPolicy"
        },
        {
          type: "doc",
          id: "api/functions/resolveModelOption",
          label: "resolveModelOption"
        },
        {
          type: "doc",
          id: "api/functions/resolveProvider",
          label: "resolveProvider"
        },
        {
          type: "doc",
          id: "api/functions/resolveProviderChain",
          label: "resolveProviderChain"
        },
        {
          type: "doc",
          id: "api/functions/resolveProviderOrder",
          label: "resolveProviderOrder"
        },
        {
          type: "doc",
          id: "api/functions/resolveRegistryForKind",
          label: "resolveRegistryForKind"
        },
        {
          type: "doc",
          id: "api/functions/resolveSecretForProvider",
          label: "resolveSecretForProvider"
        },
        {
          type: "doc",
          id: "api/functions/resumeExternalToolRequestWithRegisteredTools",
          label: "resumeExternalToolRequestWithRegisteredTools"
        },
        {
          type: "doc",
          id: "api/functions/routerNode",
          label: "routerNode"
        },
        {
          type: "doc",
          id: "api/functions/runPostApprovalGuardrails",
          label: "runPostApprovalGuardrails"
        },
        {
          type: "doc",
          id: "api/functions/runWithSpanContext",
          label: "runWithSpanContext"
        },
        {
          type: "doc",
          id: "api/functions/sanitizeAgentWorkspaceId",
          label: "sanitizeAgentWorkspaceId"
        },
        {
          type: "doc",
          id: "api/functions/scoreAndRankTraces",
          label: "scoreAndRankTraces"
        },
        {
          type: "doc",
          id: "api/functions/selectWeightedProvider",
          label: "selectWeightedProvider"
        },
        {
          type: "doc",
          id: "api/functions/serializeEmergentToolPackage",
          label: "serializeEmergentToolPackage"
        },
        {
          type: "doc",
          id: "api/functions/setDefaultProvider",
          label: "setDefaultProvider"
        },
        {
          type: "doc",
          id: "api/functions/setLoggerFactory",
          label: "setLoggerFactory"
        },
        {
          type: "doc",
          id: "api/functions/setProviderPriority",
          label: "setProviderPriority"
        },
        {
          type: "doc",
          id: "api/functions/shouldIncludeTraceIdsInAgentOSLogs",
          label: "shouldIncludeTraceIdsInAgentOSLogs"
        },
        {
          type: "doc",
          id: "api/functions/shouldIncludeTraceInAgentOSResponses",
          label: "shouldIncludeTraceInAgentOSResponses"
        },
        {
          type: "doc",
          id: "api/functions/shouldObserveAgent",
          label: "shouldObserveAgent"
        },
        {
          type: "doc",
          id: "api/functions/slugifyEntityId",
          label: "slugifyEntityId"
        },
        {
          type: "doc",
          id: "api/functions/snapshotPersonaDetails",
          label: "snapshotPersonaDetails"
        },
        {
          type: "doc",
          id: "api/functions/spreadActivation",
          label: "spreadActivation"
        },
        {
          type: "doc",
          id: "api/functions/startAgentOSSpan",
          label: "startAgentOSSpan"
        },
        {
          type: "doc",
          id: "api/functions/streamObject",
          label: "streamObject"
        },
        {
          type: "doc",
          id: "api/functions/streamText",
          label: "streamText"
        },
        {
          type: "doc",
          id: "api/functions/subgraphNode",
          label: "subgraphNode"
        },
        {
          type: "doc",
          id: "api/functions/telnyxStreamXml",
          label: "telnyxStreamXml"
        },
        {
          type: "doc",
          id: "api/functions/toolNode",
          label: "toolNode"
        },
        {
          type: "doc",
          id: "api/functions/transferStyle",
          label: "transferStyle"
        },
        {
          type: "doc",
          id: "api/functions/twilioConversationTwiml",
          label: "twilioConversationTwiml"
        },
        {
          type: "doc",
          id: "api/functions/twilioNotifyTwiml",
          label: "twilioNotifyTwiml"
        },
        {
          type: "doc",
          id: "api/functions/typedFactToScoredTrace",
          label: "typedFactToScoredTrace"
        },
        {
          type: "doc",
          id: "api/functions/unregisterImageProviderFactory",
          label: "unregisterImageProviderFactory"
        },
        {
          type: "doc",
          id: "api/functions/updateOnRetrieval",
          label: "updateOnRetrieval"
        },
        {
          type: "doc",
          id: "api/functions/upscaleImage",
          label: "upscaleImage"
        },
        {
          type: "doc",
          id: "api/functions/validateAgentExport",
          label: "validateAgentExport"
        },
        {
          type: "doc",
          id: "api/functions/validateE164",
          label: "validateE164"
        },
        {
          type: "doc",
          id: "api/functions/validateForgeShape",
          label: "validateForgeShape"
        },
        {
          type: "doc",
          id: "api/functions/variateImage",
          label: "variateImage"
        },
        {
          type: "doc",
          id: "api/functions/voiceNode",
          label: "voiceNode"
        },
        {
          type: "doc",
          id: "api/functions/withAgentOSSpan",
          label: "withAgentOSSpan"
        },
        {
          type: "doc",
          id: "api/functions/workflow",
          label: "workflow"
        },
        {
          type: "doc",
          id: "api/functions/wrapForgeTool",
          label: "wrapForgeTool"
        },
        {
          type: "doc",
          id: "api/functions/wrapOutputGuardrails",
          label: "wrapOutputGuardrails"
        },
        {
          type: "doc",
          id: "api/functions/wrapWithCrossAgentGuardrails",
          label: "wrapWithCrossAgentGuardrails"
        },
        {
          type: "doc",
          id: "api/functions/writeSkillFile",
          label: "writeSkillFile"
        },
        {
          type: "doc",
          id: "api/functions/yerksDodson",
          label: "yerksDodson"
        }
      ]
    }
  ]
};
module.exports = typedocSidebar.items;