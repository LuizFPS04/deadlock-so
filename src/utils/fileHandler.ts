import fs from 'fs';
import path from 'path';
import { InputData } from '../types/systemTypes';

export function readInputFile(filePath: string): InputData {
    const data = fs.readFileSync(filePath, 'utf-8').trim().split('\n');

    const [p, _] = data[0].split(' ').map(Number);
    if (isNaN(p) || p <= 0) {
        throw new Error(`Invalid value for processes (${p}) in file: ${filePath}`);
    }

    console.log(`Processing file: ${filePath}`);

    let resourceNumbers = new Set<number>();
    for (let i = 1; i < data.length; i++) {
        const line = data[i].split(' ').slice(1); 
        for (const resource of line) {
            const resourceNumber = parseInt(resource.substring(1));
            if (!isNaN(resourceNumber)) {
                resourceNumbers.add(resourceNumber);
            }
        }
    }

    const sortedResources = Array.from(resourceNumbers).sort((a, b) => a - b);
    const resourceMap = new Map<number, number>();
    sortedResources.forEach((res, index) => resourceMap.set(res, index));

    const totalResources = sortedResources.length;
    console.log(`🔎 Recursos detectados: ${sortedResources.join(', ')}`);

    const allocationMatrix: number[][] = Array.from({ length: p }, () => Array(totalResources).fill(0));
    const requestMatrix: number[][] = Array.from({ length: p }, () => Array(totalResources).fill(0));

    for (let i = 1; i < data.length; i++) {
        const line = data[i].split(' ');
        if (line.length === 0) continue;

        const processIndex = parseInt(line[0].substring(1)) - 1;
        if (processIndex < 0 || processIndex >= p) {
            console.warn(`Invalid process index: ${line[0]}`);
            continue;
        }

        line.slice(1).forEach(resource => {
            const resourceNumber = parseInt(resource.substring(1));
            const resourceIndex = resourceMap.get(resourceNumber);

            if (resourceIndex === undefined) {
                console.warn(`Invalid resource index: ${resource}`);
                return;
            }

            if (i % 2 === 1) {
                allocationMatrix[processIndex][resourceIndex] = 1;
            } else {
                requestMatrix[processIndex][resourceIndex] = 1;
            }
        });
    }

    return { totalProcesses: p, totalResources, allocationMatrix, requestMatrix, resourceMap };
}

export function writeOutputFile(filePath: string, results: string[]): void {
    const output = results.join('\n');
    fs.writeFileSync(filePath, output, "utf-8");
}

export function getTestFiles(directory: string): string[] {
    return fs.readdirSync(directory)
        .filter(file => file.startsWith('TESTE-') && file.endsWith('.txt'));
}
