import { _decorator, Component, Node, instantiate} from 'cc';
import {MineCell} from "db://assets/Scripts/MineCell";
const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    start() {
        this.initMatrixUI();
        this.generateMines();
    }

    private _matrixSize: number = 10;
    private _nodeMatrix: MineCell[][] = [];
    private _mineCount: number = 10;
    private _generatedMineCount: number = 0;

    private initMatrixUI() {
        const nodeTpl = this.node.getChildByName('CellTpl');

        for (let i = 0; i < this._matrixSize; i++) {
            this._nodeMatrix[i] = [];
            for (let j = 0; j < this._matrixSize; j++) {
                // clone tpl to child node
                const node = instantiate(nodeTpl);
                node.active = true;
                this._nodeMatrix[i][j] = node.getComponent(MineCell);
                this.node.addChild(node);
            }
        }

        // hide tpl
        nodeTpl.active = false;
    }

    generateMines() {
        while (this._generatedMineCount < this._mineCount) {
            const col = Math.floor(Math.random() * this._matrixSize);
            const row = Math.floor(Math.random() * this._matrixSize);
            const cell = this._nodeMatrix[col][row];

            if (cell.hasMine) {
                continue;
            }

            cell.hasMine = true;
            this._generatedMineCount++;
        }
    }

    getCell(col: number, row: number) {
        return this._nodeMatrix[col][row];
    }

    update(deltaTime: number) {
        
    }
}


