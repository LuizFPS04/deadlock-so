export interface InputData {
    totalProcesses: number;
    totalResources: number;
    allocationMatrix: number[][];
    requestMatrix: number[][];
    resourceMap: Map<number, number>;
}
