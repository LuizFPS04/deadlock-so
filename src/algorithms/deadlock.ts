import { InputData } from "../types/systemTypes";

export function detectDeadlock(inputData: InputData): string[] {
    console.log(inputData);
    const { totalProcesses, totalResources, allocationMatrix, requestMatrix, resourceMap } = inputData;
    const graph: Map<string, string[]> = new Map();

    for (let i = 0; i < totalProcesses; i++) {
        graph.set(`P${i + 1}`, []);
    }

    for (const [realResourceNumber] of resourceMap) {
        graph.set(`R${realResourceNumber}`, []);
    }

    for (let i = 0; i < totalProcesses; i++) {
        for (let j = 0; j < totalResources; j++) {
            const realResourceNumber = [...resourceMap.keys()][j];
            
            if (allocationMatrix[i][j] === 1) {
                graph.get(`R${realResourceNumber}`)?.push(`P${i + 1}`);
            }
            if (requestMatrix[i][j] === 1) {
                graph.get(`P${i + 1}`)?.push(`R${realResourceNumber}`);
            }
        }
    }

    function findCycles(): string[][] {
        const visited = new Set<string>();
        const stack = new Set<string>();
        const result: string[][] = [];

        function dfs(node: string, path: string[]) {
            if (stack.has(node)) {
                const cycleStart = path.indexOf(node);
                if (cycleStart !== -1) {
                    const cycle = path.slice(cycleStart).sort();
                    if (!result.some(existing => JSON.stringify(existing) === JSON.stringify(cycle))) {
                        result.push(cycle);
                        console.log(`🚨 Ciclo Encontrado: ${cycle.join(" ")}`);
                    }
                }
                return;
            }

            if (visited.has(node)) return;
            visited.add(node);
            stack.add(node);
            path.push(node);

            for (const neighbor of graph.get(node) || []) {
                dfs(neighbor, [...path]);
            }

            stack.delete(node);
            path.pop();
        }

        for (const node of graph.keys()) {
            dfs(node, []);
        }

        return result;
    }

    return findCycles().map(cycle => cycle.join(' '));
}
