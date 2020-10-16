import { ResourcesProviderBase, Setting } from "@axibase/charts-language-service";
import { ExternalValueCompleters } from "@axibase/charts-language-service/types/completionProvider";
import { AtsdFinancialComplete } from "./completeFinancial";

interface IDictionary { $schema: string; settings: Setting[]; }

const externalCompleters = initExternalCompleters();

function initExternalCompleters(): ExternalValueCompleters {
    let completers = {};

    let addFinancialCompletions = getSharedSetting("financial");

    if (addFinancialCompletions) {
        Object.assign(completers, new AtsdFinancialComplete().getExternalValueCompleters());
    }

    return completers;
}

function getSharedSetting(name: string): any {
    let urlParams = self.location.search;
    if (urlParams[0] === "?") {
        urlParams = urlParams.slice(1);
    }
    let params = urlParams.split("&");
    for (let param of params) {
        let [pname, value] = param.split("=");
        if (pname === name) {
            return value == null ? true : decodeURIComponent(value);
        }
    }
}

// TODO: refactor ResourcesProviderBase inheritance
const ResourcesProvider = Object.create(ResourcesProviderBase.prototype);

ResourcesProvider.readSnippets = () => {
    return require("../snippets/snippets.json");
};

ResourcesProvider.readSettings = () => {
    const jsonContent: string = require("./dictionary.json");
    const dictionary: IDictionary = (jsonContent as any) as IDictionary;

    return dictionary.settings;
};

ResourcesProvider.readDescriptions = () => {
    const content = require("./descriptions.md").default;
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
};

ResourcesProvider.settingsMap = (ResourcesProvider as any).createSettingsMap();

ResourcesProvider.getExternalValueCompleters = () => externalCompleters;

export default ResourcesProvider;
