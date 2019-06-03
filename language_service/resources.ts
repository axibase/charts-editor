import { DefaultSetting } from "./defaultSetting";
import { Setting } from "./setting";
interface IDictionary {
  $schema: string;
  settings: Setting[];
}

/**
 * Reads dictionary from "dictionary.json" file
 * @returns array of settings from the file
 */
function readSettings(): Setting[] {
  const jsonContent: string = `{
        "$schema": "./dictionary.schema.json",
        "settings": [
            {
                "displayName": "add-meta",
                "type": "boolean",
                "section": "series",
                "example": true,
                "defaultValue": false
            },
            {
                "displayName": "ahead-time-span",
                "type": "string",
                "section": "widget",
                "widget": "chart",
                "example": "80%"
            },
            {
                "displayName": "alert-expression",
                "type": "string",
                "section": [
                    "column",
                    "widget"
                ],
                "example": "value > 5",
                "script": {
                    "returnValue": "boolean",
                    "fields": [
                        {
                            "name": "metric",
                            "type": "string"
                        },
                        {
                            "name": "entity",
                            "type": "string"
                        },
                        {
                            "name": "tags",
                            "type": "object"
                        },
                        {
                            "name": "value",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "previous",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "movavg",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "count",
                                    "type": "number",
                                    "required": true
                                },
                                {
                                    "name": "minCount",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "detail",
                            "type": "function"
                        },
                        {
                            "name": "forecast",
                            "type": "function"
                        },
                        {
                            "name": "forecast_deviation",
                            "type": "function"
                        },
                        {
                            "name": "lower_confidence",
                            "type": "function"
                        },
                        {
                            "name": "upper_confidence",
                            "type": "function"
                        },
                        {
                            "name": "percentile",
                            "type": "function",
                            "args": [
                                {
                                    "name": "percentage",
                                    "type": "number",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "max",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "maximum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "min",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "minimum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "avg",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "average",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "sum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "delta",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "counter",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "last",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "first",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "min_value_time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "max_value_time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "count",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "threshold_count",
                            "type": "function"
                        },
                        {
                            "name": "threshold_percent",
                            "type": "function"
                        },
                        {
                            "name": "threshold_duration",
                            "type": "function"
                        },
                        {
                            "name": "time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "bottom",
                            "type": "function",
                            "args": [
                                {
                                    "name": "rank",
                                    "type": "integer",
                                    "required": true
                                },
                                {
                                    "name": "getValue",
                                    "type": "function"
                                }
                            ]
                        },
                        {
                            "name": "top",
                            "type": "function",
                            "args": [
                                {
                                    "name": "rank",
                                    "type": "integer",
                                    "required": true
                                },
                                {
                                    "name": "getValue",
                                    "type": "function"
                                }
                            ]
                        },
                        {
                            "name": "meta",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "entityTag",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "tagName",
                                    "type": "string",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "metricTag",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "tagName",
                                    "type": "string",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "median",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "series",
                            "type": "array"
                        }
                    ]
                }
            },
            {
                "displayName": "alert-row-style",
                "multiLine": true,
                "type": "string",
                "example": "background-color: red"
            },
            {
                "displayName": "alert-style",
                "multiLine": true,
                "type": "string",
                "section": "series",
                "example": "stroke: red; stroke-width: 2",
                "script": {
                    "returnValue": "string",
                    "fields": [
                        {
                            "name": "alert",
                            "type": "number"
                        }
                    ]
                }
            },
            {
                "displayName": "alias",
                "type": "string",
                "section": "series",
                "example": "s1"
            },
            {
                "displayName": "align",
                "type": "enum",
                "section": "widget",
                "example": "END_TIME",
                "defaultValue": "CALENDAR",
                "enum": [
                    "END_TIME",
                    "START_TIME",
                    "CALENDAR",
                    "FIRST_VALUE_TIME"
                ]
            },
            {
                "displayName": "arcs",
                "type": "boolean",
                "section": "widget",
                "widget": "graph",
                "defaultValue": true,
                "example": false
            },
            {
                "displayName": "arrow-length",
                "type": "number",
                "section": "widget",
                "widget": "gauge",
                "example": "0.3, 30%",
                "maxValue": 1,
                "minValue": 0
            },
            {
                "displayName": "arrows",
                "type": "boolean",
                "section": "widget",
                "widget": "graph",
                "defaultValue": false,
                "example": true
            },
            {
                "displayName": "attribute",
                "section": "series",
                "type": "string",
                "example": "my_attribute",
                "excludes": [
                    "metric"
                ]
            },
            {
                "displayName": "audio-alert",
                "type": "string",
                "section": "series",
                "example": "(alert > 0.5) ? '/portal/resource/alarm.ogg' : '/portal/resource/klaxon.ogg'",
                "script": {
                    "fields": [
                        {
                            "name": "alert",
                            "type": "number"
                        }
                    ],
                    "returnValue": "string"
                }
            },
            {
                "displayName": "audio-onload",
                "type": "boolean",
                "section": "widget",
                "defaultValue": false,
                "example": true
            },
            {
                "displayName": "author",
                "type": "string",
                "example": "my_name"
            },
            {
                "displayName": "auto-height",
                "type": "boolean",
                "section": "widget",
                "defaultValue": false,
                "example": true
            },
            {
                "displayName": "auto-padding",
                "type": "boolean",
                "section": "widget",
                "widget": "graph",
                "defaultValue": true,
                "example": false
            },
            {
                "displayName": "auto-period",
                "type": "boolean",
                "section": "widget",
                "widget": "chart",
                "defaultValue": true,
                "example": false
            },
            {
                "displayName": "auto-scale",
                "type": "boolean",
                "section": "widget",
                "widget": "chart",
                "defaultValue": false,
                "example": true
            },
            {
                "displayName": "axis",
                "type": "enum",
                "defaultValue": "left",
                "section": "series",
                "example": "right",
                "enum": [
                    "right",
                    "left"
                ]
            },
            {
                "displayName": "axis-title",
                "type": "string",
                "section": "widget",
                "example": "CPU Utilization in %"
            },
            {
                "displayName": "axis-title-left",
                "type": "string",
                "section": "widget",
                "example": "CPU Utilization in %"
            },
            {
                "displayName": "axis-title-right",
                "type": "string",
                "section": "widget",
                "example": "CPU Utilization in %"
            },
            {
                "displayName": "bar-count",
                "type": "integer",
                "section": "widget",
                "widget": "histogram",
                "example": 20
            },
            {
                "displayName": "batch-size",
                "type": "integer",
                "section": "widget",
                "example": 1,
                "defaultValue": 8
            },
            {
                "displayName": "batch-update",
                "type": "boolean",
                "example": true,
                "section": "widget",
                "defaultValue": false
            },
            {
                "displayName": "border-width",
                "type": "number",
                "example": 0.3,
                "section": "widget",
                "widget": "gauge"
            },
            {
                "displayName": "bottom-axis",
                "type": "enum",
                "defaultValue": "values",
                "section": "widget",
                "widget": "histogram",
                "example": "none",
                "enum": [
                    "none",
                    "percentiles",
                    "values"
                ]
            },
            {
                "displayName": "bundle",
                "section": "widget",
                "widget": "graph",
                "type": "boolean",
                "example": false,
                "defaultValue": true
            },
            {
                "displayName": "bundled",
                "section": "widget",
                "widget": "graph",
                "type": "boolean",
                "example": false,
                "defaultValue": true
            },
            {
                "displayName": "buttons",
                "type": "enum",
                "section": "widget",
                "example": "menu",
                "enum": [
                    "menu",
                    "update"
                ]
            },
            {
                "displayName": "cache",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget"
            },
            {
                "displayName": "capitalize",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "widget"
            },
            {
                "displayName": "caption",
                "type": "string",
                "example": "KPI",
                "section": "widget"
            },
            {
                "displayName": "caption-style",
                "multiLine": true,
                "type": "string",
                "example": "color: silver",
                "section": "widget"
            },
            {
                "displayName": "case",
                "type": "enum",
                "enum": [
                    "upper",
                    "lower"
                ],
                "example": "upper",
                "section": "widget",
                "widget": "property"
            },
            {
                "displayName": "centralize-columns",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget"
            },
            {
                "displayName": "centralize-ticks",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget"
            },
            {
                "displayName": "change-field",
                "type": "string",
                "example": "series.entity",
                "section": "dropdown"
            },
            {
                "displayName": "circle",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget",
                "widget": "text"
            },
            {
                "displayName": "class",
                "type": "enum",
                "example": "terminal",
                "enum": [
                    "terminal",
                    "metro"
                ],
                "section": "widget",
                "override": {
                    "[widget == 'console' || widget == 'property']": {
                        "enum": [
                            "terminal"
                        ]
                    },
                    "[widget == 'box']": {
                        "enum": [
                            "metro"
                        ]
                    }
                }
            },
            {
                "displayName": "collapsible",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "widget"
            },
            {
                "displayName": "color",
                "type": "string",
                "example": "orange",
                "section": "series",
                "excludes": [
                    "colors",
                    "color-range"
                ]
            },
            {
                "displayName": "color-range",
                "type": "string",
                "example": "black, blue",
                "excludes": [
                    "colors",
                    "color"
                ],
                "possibleValues": [
                    {
                        "value": "blue"
                    },
                    {
                        "value": "red"
                    },
                    {
                        "value": "black"
                    },
                    {
                        "value": "green"
                    },
                    {
                        "value": "yellow"
                    },
                    {
                        "value": "silver"
                    }
                ]
            },
            {
                "displayName": "colors",
                "type": "string",
                "example": "green",
                "section": "widget",
                "excludes": [
                    "color-range",
                    "color"
                ]
            },
            {
                "displayName": "column-alert-expression",
                "type": "string",
                "example": "value > 10",
                "section": "column"
            },
            {
                "displayName": "column-alert-style",
                "type": "string",
                "example": "fill: red; stroke: red",
                "section": "column"
            },
            {
                "displayName": "column-entity",
                "type": "string",
                "example": "Entity",
                "section": "widget"
            },
            {
                "displayName": "column-metric",
                "type": "string",
                "example": "Temperature",
                "section": "widget"
            },
            {
                "displayName": "column-time",
                "type": "string",
                "example": "Time in seconds",
                "section": "widget"
            },
            {
                "displayName": "column-value",
                "type": "string",
                "example": "CPU Usage",
                "section": "widget"
            },
            {
                "displayName": "column-label-format",
                "type": "string",
                "example": "tags.mount_point",
                "section": "column",
                "defaultValue": "entity: metric: tagName=tagValue: statistics - period",
                "possibleValues": [
                    {
                        "value": "entity"
                    },
                    {
                        "value": "metric"
                    },
                    {
                        "value": "tagName"
                    },
                    {
                        "value": "tagValue"
                    },
                    {
                        "value": "tags.{tag-name}"
                    },
                    {
                        "value": "statistics"
                    },
                    {
                        "value": "period"
                    }
                ]
            },
            {
                "displayName": "context-height",
                "type": "integer",
                "example": 50,
                "defaultValue": 0
            },
            {
                "displayName": "context-path",
                "type": "string",
                "example": "/hbs",
                "defaultValue": "/api/v1",
                "section": "configuration"
            },
            {
                "displayName": "counter",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "series"
            },
            {
                "displayName": "counter-position",
                "type": "enum",
                "example": "none",
                "section": "widget",
                "widget": "gauge",
                "enum": [
                    "none",
                    "top",
                    "bottom"
                ]
            },
            {
                "displayName": "current-period-style",
                "multiLine": true,
                "type": "string",
                "example": "fill-opacity: 0; stroke-width: 2; stroke-dasharray: 5, 2, 1, 2",
                "section": "widget",
                "widget": "chart"
            },
            {
                "displayName": "data",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget",
                "widget": "graph"
            },
            {
                "displayName": "data-labels",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget",
                "widget": "calendar"
            },
            {
                "displayName": "data-type",
                "type": "enum",
                "example": "forecast",
                "enum": [
                    "history",
                    "forecast",
                    "forecast_deviation",
                    "lower_confidence",
                    "upper_confidence"
                ],
                "section": "series"
            },
            {
                "displayName": "day-format",
                "type": "string",
                "example": "%y/%m/%d",
                "possibleValues": [
                    {
                        "value": "%a",
                        "detail": "Three-letter abbreviated day name, for example: Sun, Mon, Tue, Wed, Thu, Fri, Sat."
                    },
                    {
                        "value": "%aa",
                        "detail": "Two-letter abbreviated day name, for example: Su, Mo, Tu, We, Th, Fr, Sa."
                    },
                    {
                        "value": "%A",
                        "detail": "Full day name."
                    },
                    {
                        "value": "%b",
                        "detail": "Abbreviated month name."
                    },
                    {
                        "value": "%B",
                        "detail": "Full month name."
                    },
                    {
                        "value": "%d",
                        "detail": "Zero-padded day of the month as a decimal number [01,31]."
                    },
                    {
                        "value": "%e",
                        "detail": "Space-padded day of the month as a decimal number [ 1,31]. Equivalent to %_d."
                    },
                    {
                        "value": "%j",
                        "detail": "Day of the year as a decimal number [001,366]."
                    },
                    {
                        "value": "%m",
                        "detail": "Month as a decimal number [01,12]."
                    },
                    {
                        "value": "%U",
                        "detail": "Week number of the year as a decimal number [00,53]. Sunday is the first day of the week."
                    },
                    {
                        "value": "%w",
                        "detail": "Weekday as a decimal number [0(Sunday),6]."
                    },
                    {
                        "value": "%W",
                        "detail": "Week number of the year as a decimal number [00,53]. Monday is the first day of the week."
                    },
                    {
                        "value": "%x",
                        "detail": "Date, as %m/%d/%Y."
                    },
                    {
                        "value": "%y",
                        "detail": "Year without century as a decimal number [00,99]."
                    },
                    {
                        "value": "%Y",
                        "detail": "Year with century as a decimal number."
                    }
                ],
                "section": "widget"
            },
            {
                "displayName": "default-color",
                "type": "string",
                "example": "magenta",
                "section": "series"
            },
            {
                "displayName": "default-size",
                "type": "number",
                "example": 2,
                "defaultValue": 1,
                "section": "widget",
                "widget": "treemap"
            },
            {
                "displayName": "depth",
                "type": "integer",
                "example": 3,
                "section": "widget",
                "widget": "graph"
            },
            {
                "displayName": "description",
                "type": "string",
                "example": "My configuration"
            },
            {
                "displayName": "dialog-maximize",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "widget"
            },
            {
                "displayName": "disable-alert",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget",
                "widget": "page"
            },
            {
                "displayName": "disconnect-count",
                "type": "integer",
                "example": 50,
                "section": "widget",
                "widget": "chart"
            },
            {
                "displayName": "disconnected-node-display",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "widget",
                "widget": "graph"
            },
            {
                "displayName": "disconnect-interval",
                "type": "interval",
                "example": "1 minute",
                "section": "widget",
                "widget": "chart"
            },
            {
                "displayName": "disconnect-value",
                "type": "integer",
                "example": 0,
                "section": "widget",
                "widget": "chart"
            },
            {
                "displayName": "display",
                "type": "string",
                "example": "value > top(3)",
                "section": "series",
                "script": {
                    "returnValue": "boolean",
                    "fields": [
                        {
                            "name": "metric",
                            "type": "string"
                        },
                        {
                            "name": "entity",
                            "type": "string"
                        },
                        {
                            "name": "tags",
                            "type": "object"
                        },
                        {
                            "name": "value",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "previous",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "movavg",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "count",
                                    "type": "number",
                                    "required": true
                                },
                                {
                                    "name": "minCount",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "detail",
                            "type": "function"
                        },
                        {
                            "name": "forecast",
                            "type": "function"
                        },
                        {
                            "name": "forecast_deviation",
                            "type": "function"
                        },
                        {
                            "name": "lower_confidence",
                            "type": "function"
                        },
                        {
                            "name": "upper_confidence",
                            "type": "function"
                        },
                        {
                            "name": "percentile",
                            "type": "function",
                            "args": [
                                {
                                    "name": "percentage",
                                    "type": "number",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "max",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "maximum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "min",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "minimum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "avg",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "average",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "sum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "delta",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "counter",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "last",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "first",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "min_value_time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "max_value_time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "count",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "threshold_count",
                            "type": "function"
                        },
                        {
                            "name": "threshold_percent",
                            "type": "function"
                        },
                        {
                            "name": "threshold_duration",
                            "type": "function"
                        },
                        {
                            "name": "time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "bottom",
                            "type": "function",
                            "args": [
                                {
                                    "name": "rank",
                                    "type": "integer",
                                    "required": true
                                },
                                {
                                    "name": "getValue",
                                    "type": "function"
                                }
                            ]
                        },
                        {
                            "name": "top",
                            "type": "function",
                            "args": [
                                {
                                    "name": "rank",
                                    "type": "integer",
                                    "required": true
                                },
                                {
                                    "name": "getValue",
                                    "type": "function"
                                }
                            ]
                        },
                        {
                            "name": "meta",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "entityTag",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "tagName",
                                    "type": "string",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "metricTag",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "tagName",
                                    "type": "string",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "median",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "series",
                            "type": "array"
                        }
                    ]
                }
            },
            {
                "displayName": "display-date",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget",
                "widget": "chart"
            },
            {
                "displayName": "display-in-legend",
                "type": "boolean",
                "example": false,
                "section": "series"
            },
            {
                "displayName": "display-labels",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "widget",
                "widget": "treemap"
            },
            {
                "displayName": "display-other",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "widget",
                "widget": "pie"
            },
            {
                "displayName": "display-panels",
                "type": "enum",
                "example": "true",
                "defaultValue": "hover",
                "section": "widget",
                "enum": [
                    "true",
                    "false",
                    "hover"
                ]
            },
            {
                "displayName": "display-tags",
                "type": "string",
                "example": "mount_point",
                "defaultValue": false,
                "section": "widget"
            },
            {
                "displayName": "display-ticks",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "widget": "gauge",
                "section": "widget"
            },
            {
                "displayName": "display-tip",
                "type": "boolean",
                "example": true,
                "widget": "gauge",
                "section": "widget"
            },
            {
                "displayName": "display-total",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "widget": "treemap",
                "section": "widget"
            },
            {
                "displayName": "display-values",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "widget",
                "widget": "bar"
            },
            {
                "displayName": "downsample",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "widget"
            },
            {
                "displayName": "downsample-algorithm",
                "type": "enum",
                "example": "DETAIL",
                "section": "widget",
                "enum": [
                    "DETAIL",
                    "INTERPOLATE"
                ]
            },
            {
                "displayName": "downsample-difference",
                "type": "number",
                "example": 4,
                "minValue": 0,
                "section": "widget",
                "excludes": [
                    "downsample-ratio"
                ]
            },
            {
                "displayName": "downsample-ratio",
                "type": "number",
                "example": 2,
                "minValue": 1,
                "section": "widget",
                "excludes": [
                    "downsample-difference"
                ]
            },
            {
                "displayName": "downsample-gap",
                "type": "interval",
                "example": "10 minute",
                "section": "widget"
            },
            {
                "displayName": "downsample-order",
                "type": "integer",
                "example": 5,
                "minValue": 0,
                "section": "widget"
            },
            {
                "displayName": "duration",
                "type": "integer",
                "example": 2000,
                "defaultValue": 1000,
                "widget": "graph",
                "section": "widget"
            },
            {
                "displayName": "effects",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "widget": "graph",
                "section": "widget"
            },
            {
                "displayName": "empty-refresh-interval",
                "type": "interval",
                "example": "5 minute",
                "section": "series"
            },
            {
                "displayName": "empty-threshold",
                "type": "interval",
                "example": "5 minute",
                "section": "series"
            },
            {
                "displayName": "enabled",
                "type": "string",
                "example": false,
                "section": "series",
                "script": {
                    "returnValue": "boolean",
                    "fields": [
                        {
                            "name": "metric",
                            "type": "string"
                        },
                        {
                            "name": "entity",
                            "type": "string"
                        },
                        {
                            "name": "tags",
                            "type": "object"
                        },
                        {
                            "name": "value",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "previous",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "movavg",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "count",
                                    "type": "number",
                                    "required": true
                                },
                                {
                                    "name": "minCount",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "detail",
                            "type": "function"
                        },
                        {
                            "name": "forecast",
                            "type": "function"
                        },
                        {
                            "name": "forecast_deviation",
                            "type": "function"
                        },
                        {
                            "name": "lower_confidence",
                            "type": "function"
                        },
                        {
                            "name": "upper_confidence",
                            "type": "function"
                        },
                        {
                            "name": "percentile",
                            "type": "function",
                            "args": [
                                {
                                    "name": "percentage",
                                    "type": "number",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "max",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "maximum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "min",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "minimum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "count",
                                    "type": "number"
                                }
                            ]
                        },
                        {
                            "name": "avg",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "average",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "sum",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "delta",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "counter",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "last",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "first",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "min_value_time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "max_value_time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "count",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "threshold_count",
                            "type": "function"
                        },
                        {
                            "name": "threshold_percent",
                            "type": "function"
                        },
                        {
                            "name": "threshold_duration",
                            "type": "function"
                        },
                        {
                            "name": "time",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "bottom",
                            "type": "function",
                            "args": [
                                {
                                    "name": "rank",
                                    "type": "integer",
                                    "required": true
                                },
                                {
                                    "name": "getValue",
                                    "type": "function"
                                }
                            ]
                        },
                        {
                            "name": "top",
                            "type": "function",
                            "args": [
                                {
                                    "name": "rank",
                                    "type": "integer",
                                    "required": true
                                },
                                {
                                    "name": "getValue",
                                    "type": "function"
                                }
                            ]
                        },
                        {
                            "name": "meta",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                }
                            ]
                        },
                        {
                            "name": "entityTag",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "tagName",
                                    "type": "string",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "metricTag",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string",
                                    "required": true
                                },
                                {
                                    "name": "tagName",
                                    "type": "string",
                                    "required": true
                                }
                            ]
                        },
                        {
                            "name": "median",
                            "type": "function",
                            "args": [
                                {
                                    "name": "alias",
                                    "type": "string"
                                },
                                {
                                    "name": "period",
                                    "type": "interval"
                                }
                            ]
                        },
                        {
                            "name": "series",
                            "type": "array"
                        }
                    ]
                }
            },
            {
                "displayName": "end-time",
                "type": "date",
                "example": "previous_working_day",
                "section": "widget"
            },
            {
                "displayName": "end-working-minutes",
                "type": "integer",
                "example": 60,
                "defaultValue": 1440,
                "section": "series",
                "minValue": 0
            },
            {
                "displayName": "entities",
                "type": "string",
                "example": "nurswgvml111, nurswgvml00*",
                "section": "series",
                "excludes": [
                    "entity",
                    "entity-expression",
                    "entity-group",
                    "entity-label"
                ]
            },
            {
                "displayName": "entity",
                "type": "string",
                "example": "nurswgvml*",
                "section": "series",
                "excludes": [
                    "entities",
                    "entity-expression",
                    "entity-group"
                ]
            },
            {
                "displayName": "entity-expression",
                "type": "string",
                "example": "tags.app = 'ATSD'",
                "section": "series",
                "excludes": [
                    "entities",
                    "entity",
                    "entity-group"
                ]
            },
            {
                "displayName": "entity-group",
                "type": "string",
                "example": "nmob-sub-group",
                "section": "series",
                "excludes": [
                    "entities",
                    "entity",
                    "entity-expression"
                ]
            },
            {
                "displayName": "entity-label",
                "type": "string",
                "example": "srv007",
                "section": "widget"
            },
            {
                "displayName": "error-refresh-interval",
                "type": "interval",
                "example": "30 minute",
                "section": "series"
            },
            {
                "displayName": "exact-match",
                "type": "boolean",
                "example": true,
                "section": "series"
            },
            {
                "displayName": "expand",
                "type": "boolean",
                "example": true,
                "section": "series",
                "widget": "pie"
            },
            {
                "displayName": "expand-panels",
                "type": "enum",
                "example": "all",
                "defaultValue": "compact",
                "enum": [],
                "section": "widget",
                "override": {
                    "[widget == 'chart']": {
                        "enum": [
                            "true",
                            "all",
                            "default",
                            "auto",
                            "compact",
                            "false",
                            "none"
                        ]
                    },
                    "[section == 'configuration']": {
                        "enum": [
                            "true",
                            "all",
                            "default",
                            "auto",
                            "compact",
                            "false",
                            "none"
                        ]
                    }
                }
            },
            {
                "displayName": "expand-tags",
                "type": "boolean",
                "example": true,
                "section": "widget",
                "widget": "property"
            },
            {
                "displayName": "expire-time-span",
                "type": "interval",
                "example": "10 day",
                "section": "widget",
                "widget": "table"
            },
            {
                "displayName": "fill-value",
                "type": "boolean",
                "example": false,
                "defaultValue": true,
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "filter",
                "type": "string",
                "example": "value > 1",
                "section": "series"
            },
            {
                "displayName": "filter-range",
                "type": "boolean",
                "example": true,
                "defaultValue": false,
                "section": "series"
            },
            {
                "displayName": "fit-svg",
                "type": "boolean",
                "example": true,
                "section": "widget",
                "widget": "page"
            },
            {
                "displayName": "font-scale",
                "type": "number",
                "example": 0.7,
                "defaultValue": 0.5,
                "minValue": 0,
                "maxValue": 1,
                "section": "widget"
            },
            {
                "displayName": "font-size",
                "type": "integer",
                "example": 42,
                "section": "widget",
                "widget": "treemap"
            },
            {
                "displayName": "forecast-arima-auto",
                "type": "boolean",
                "example": "true",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-arima-auto-regression-interval",
                "type": "interval",
                "example": "1 week",
                "section": "series",
                "widget": "chart",
                "excludes": [
                    "forecast-arima-p"
                ]
            },
            {
                "displayName": "forecast-arima-d",
                "type": "number",
                "example": "5",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-arima-p",
                "type": "enum",
                "example": "1",
                "section": "series",
                "widget": "chart",
                "enum": [
                    "0",
                    "1"
                ],
                "excludes": [
                    "forecast-arima-auto-regression-interval"
                ]
            },
            {
                "displayName": "forecast-horizon-interval",
                "type": "interval",
                "example": "3 day",
                "section": "series",
                "widget": "chart",
                "excludes": [
                    "forecast-horizon-length",
                    "forecast-horizon-end-time"
                ]
            },
            {
                "displayName": "forecast-horizon-length",
                "type": "integer",
                "example": "100",
                "section": "series",
                "widget": "chart",
                "minValue": 0,
                "excludes": [
                    "forecast-horizon-interval",
                    "forecast-horizon-end-time"
                ]
            },
            {
                "displayName": "forecast-horizon-start-time",
                "type": "date",
                "example": "2019-02-05T00:00:00Z",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-horizon-end-time",
                "type": "date",
                "example": "2019-02-06T00:00:00Z",
                "section": "series",
                "widget": "chart",
                "excludes": [
                    "forecast-horizon-interval",
                    "forecast-horizon-length"
                ]
            },
            {
                "displayName": "forecast-hw-auto",
                "type": "boolean",
                "example": "true",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-hw-period",
                "type": "interval",
                "example": "1 year",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-hw-alpha",
                "type": "number",
                "example": "0.6",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-hw-beta",
                "type": "number",
                "example": "0.1",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-hw-gamma",
                "type": "number",
                "example": "0.1",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-include",
                "type": "string",
                "example": "HISTORY, FORECAST",
                "section": "series",
                "defaultValue": "FORECAST",
                "enum": [
                    "FORECAST",
                    "HISTORY",
                    "RECONSTRUCTED"
                ],
                "widget": "chart"
            },
            {
                "displayName": "forecast-name",
                "type": "string",
                "example": "hw5",
                "section": "series",
                "widget": "chart"
            },
            {
                "displayName": "forecast-score-interval",
                "type": "interval",
                "example": "1 day",
                "section": "series",
                "widget": "chart"
            }
        ]
    }`;
  const dictionary: IDictionary = JSON.parse(jsonContent) as IDictionary;

  return dictionary.settings;
}

/**
 * Reads descriptions from "descriptions.md" file
 * @returns map of settings names and descriptions
 */
function readDescriptions(): Map<string, string> {
  const content: string = "";
  const map: Map<string, string> = new Map();
  // ## settingname\n\nsetting description[url](hello#html)\n
  const regExp: RegExp = /\#\# ([a-z]+?)  \n  \n([^\s#][\S\s]+?)  (?=\n  (?:\n(?=\#)|$))/g;
  let match: RegExpExecArray | null = regExp.exec(content);
  while (match !== null) {
    const [, name, description] = match;
    map.set(name, description);
    match = regExp.exec(content);
  }

  return map;
}

/**
 * Tests if the provided setting complete or not
 * @param setting the setting to test
 * @returns true, if setting is complete, false otherwise
 */
function isCompleteSetting(setting?: Partial<Setting>): boolean {
  return (
    setting !== undefined &&
    setting.displayName !== undefined &&
    setting.type !== undefined &&
    setting.example !== undefined
  );
}

/**
 * @returns map of settings, key is the setting name, value is instance of Setting
 */
function createSettingsMap(): Map<string, DefaultSetting> {
  const descriptions: Map<string, string> = readDescriptions();
  const settings: Setting[] = readSettings();
  const map: Map<string, Setting> = new Map();
  for (const setting of settings) {
    if (isCompleteSetting(setting)) {
      const name: string = Setting.clearSetting(setting.displayName);
      Object.assign(setting, { name, description: descriptions.get(name) });
      const completeSetting: Setting = new Setting(setting);
      map.set(completeSetting.name, completeSetting);
    }
  }

  return map;
}

export const settingsMap: Map<string, DefaultSetting> = createSettingsMap();

interface SectionRequirements {
  settings?: DefaultSetting[][];
  sections?: string[][];
}
/**
 * Map of required settings for each section and their "aliases".
 * For instance, `series` requires `entity`, but `entities` is also allowed.
 * Additionally, `series` requires `metric`, but `table` with `attribute` is also ok
 */
export const requiredSectionSettingsMap = new Map<string, SectionRequirements>([
  [
    "configuration",
    {
      sections: [["group"]]
    }
  ],
  [
    "series",
    {
      settings: [
        [
          settingsMap.get("entity")!,
          settingsMap.get("value")!,
          settingsMap.get("entities")!,
          settingsMap.get("entitygroup")!,
          settingsMap.get("entityexpression")!
        ],
        [
          settingsMap.get("metric")!,
          settingsMap.get("value")!,
          settingsMap.get("table")!,
          settingsMap.get("attribute")!
        ]
      ]
    }
  ],
  [
    "group",
    {
      sections: [["widget"]]
    }
  ],
  [
    "widget",
    {
      sections: [["series"]],
      settings: [[settingsMap.get("type")!]]
    }
  ],
  [
    "dropdown",
    {
      settings: [
        [settingsMap.get("onchange")!, settingsMap.get("changefield")!]
      ]
    }
  ],
  [
    "node",
    {
      settings: [[settingsMap.get("id")]]
    }
  ]
]);

export const widgetRequirementsByType: Map<
  string,
  SectionRequirements
> = new Map([
  [
    "console",
    {
      sections: []
    }
  ],
  [
    "page",
    {
      sections: []
    }
  ],
  [
    "property",
    {
      sections: [["property"]]
    }
  ],
  [
    "graph",
    {
      sections: [["series", "node", "link"]]
    }
  ]
]);

/**
 * Key is section name, value is array of parent sections for the key section
 */
export const parentSections: Map<string, string[]> = new Map([
  ["widget", ["group", "configuration"]],
  ["series", ["widget", "link"]],
  ["tag", ["series"]],
  ["tags", ["series"]],
  ["column", ["widget"]],
  ["node", ["widget"]],
  ["link", ["widget"]],
  ["option", ["dropdown"]]
]);

/**
 * @returns true if the current section is nested in the previous section
 */
export function isNestedToPrevious(
  currentName: string,
  previousName: string
): boolean {
  if (currentName === undefined || previousName === undefined) {
    return false;
  }

  return getParents(currentName).includes(previousName);
}

/**
 * @returns array of parent sections for the section
 */
export function getParents(section: string): string[] {
  let parents: string[] = [];
  const found: string[] | undefined = parentSections.get(section);
  if (found !== undefined) {
    for (const father of found) {
      // JS recursion is not tail-optimized, replace if possible
      parents = parents.concat(father, getParents(father));
    }
  }

  return parents;
}

export const sectionDepthMap: { [section: string]: number } = {
  configuration: 0,

  group: 1,

  widget: 2,

  column: 3,
  dropdown: 3,
  keys: 3,
  link: 3,
  node: 3,
  other: 3,
  placeholders: 3,
  property: 3,
  series: 3,
  threshold: 3,

  option: 4,
  properties: 4,
  tag: 4,
  tags: 4
};

/**
 * Contains names of sections which can appear at depth `1..max_depth`, where
 * `max_depth` is a value from `sectionDepthMap`
 */
export const inheritableSections: Set<string> = new Set(["keys", "tags"]);
