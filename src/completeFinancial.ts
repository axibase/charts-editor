import { ExternalValueCompleters } from "@axibase/charts-language-service/types/completionProvider";

export class AtsdFinancialComplete {
    private cachedInstruments: string[] | null = null;
    private cachedSymbols: string[] | null = null;
    private cachedClasses: string[] | null = null;

    public completeInstrument(_prefix: string): Promise<string[]> {
        if (this.cachedInstruments != null) {
            return Promise.resolve(this.cachedInstruments);
        }

        const url = `/financial/instruments/suggest/instrument`;
        return fetch(url, {method: "POST"})
            .then(resp => resp.json() as Promise<string[]>)
            .catch(_ => [])
            .then(insts => {
                this.cachedInstruments = insts;
                return insts;
            });
    }

    public completeSymbol(_prefix: string): Promise<string[]> {
        if (this.cachedSymbols != null) {
            return Promise.resolve(this.cachedSymbols);
        }

        const url = `/financial/instruments/suggest/symbol`;
        return fetch(url, {method: "POST"})
            .then(resp => resp.json() as Promise<string[]>)
            .catch(_ => [])
            .then(symbols => {
                this.cachedSymbols = symbols;
                return symbols;
            });
    }

    public completeClass(_prefix: string): Promise<string[]> {
        if (this.cachedClasses != null) {
            return Promise.resolve(this.cachedClasses);
        }

        const url = `/financial/instruments/suggest/class`;
        return fetch(url, {method: "POST"})
            .then(resp => resp.json() as Promise<string[]>)
            .catch(_ => [])
            .then(classes => {
                this.cachedClasses = classes;
                return classes;
            });
    }

    public getExternalValueCompleters(): ExternalValueCompleters {
        return {
            "class": (pfx) => this.completeClass(pfx),
            "instrument": (pfx) => this.completeInstrument(pfx),
            "symbol": (pfx) => this.completeSymbol(pfx),
        };
    }
}
