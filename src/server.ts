import * as path from 'path';
import { readInputFile, writeOutputFile, getTestFiles } from './utils/fileHandler';
import { detectDeadlock } from './algorithms/deadlock';

const directory = "C://Users//luizf//OneDrive//Área de Trabalho//deadlock-so//src//docs";
const directoryDestiny = path.resolve(__dirname, './doc-parsed');

const files = getTestFiles(directory);

files.forEach(file => {
    const inputFilePath = path.join(directory, file);
    const outputFileName = file.replace('.txt', '-RESULTADO.txt');
    const outputFilePath = path.join(directoryDestiny, outputFileName);

    const inputData = readInputFile(inputFilePath);
    const deadlocks = detectDeadlock(inputData);

    writeOutputFile(outputFilePath, deadlocks);
    console.log(`File ${outputFilePath} generated.`);
});
