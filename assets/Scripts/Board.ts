import {_decorator, Component, instantiate, Node, Label} from 'cc';
import {MineCell} from "db://assets/Scripts/MineCell";
import {CellState} from "db://assets/Scripts/types/cell";
import {Timer} from "db://assets/Scripts/Utils/Timer";
import {GameStatus} from "db://assets/Scripts/GameStatus";
import {GameStatus as Status} from "db://assets/Scripts/types/status";

const { ccclass, property } = _decorator;

@ccclass('Board')
export class Board extends Component {
    start() {
        this.initMatrixUI();
        this.generateMines();

        this.status = this.statusIcon.getComponent(GameStatus);
        // this.status.setStatus(Status.Running)
    }


    @property({ type: Node })
    public statusIcon: Node | null;

    @property({ type: Node })
    public stats: Node | null;

    private _matrixSize: number = 10;
    private _nodeMatrix: MineCell[][] = [];
    private _mineCount: number = 10;
    private _generatedMineCount: number = 0;

    private _timer = new Timer();
    private status: GameStatus;

    private _stats: Label;

    private setStats(stats: string) {
        this._stats.string = stats;
    }

    private clearStats() {
        this._stats.string = '';
    }

    private initMatrixUI() {
        const nodeTpl = this.node.getChildByName('CellTpl');

        for (let i = 0; i < this._matrixSize; i++) {
            this._nodeMatrix[i] = [];
            for (let j = 0; j < this._matrixSize; j++) {
                // clone tpl to child node
                const node = instantiate(nodeTpl);
                node.active = true;
                const comp = node.getComponent(MineCell);
                comp.attachToBoard(this);
                comp.assignPosition(i, j);
                this._nodeMatrix[i][j] = comp;
                this.node.addChild(node);
            }
        }

        // hide tpl
        nodeTpl.active = false;

        this._stats = this.stats.getComponent(Label);
        this.clearStats();
    }

    public isWin(): boolean {
        let count = 0;
        for (let i = 0; i < this._matrixSize; i++) {
            for (let j = 0; j < this._matrixSize; j++) {
                const cell = this._nodeMatrix[i][j];
                if (cell.isRevealed() && !cell.hasMine) {
                    count++;
                }
            }
        }

        return count === this._matrixSize * this._matrixSize - this._mineCount;
    }

    public autoReveal(cell: MineCell) {
        if (cell.isRevealed()) {
            return;
        }

        cell.reveal();

        if (cell.state !== CellState.Empty) {
            return;
        }

        const neighbours = this.getNeighbours(cell);
        for (const neighbour of neighbours) {
            this.autoReveal(neighbour);
        }
    }

    private getNeighbours(cell: MineCell): MineCell[] {
        const col = cell.getCol();
        const row = cell.getRow();
        const neighbours: MineCell[] = [];

        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const nCol = col + i;
                const nRow = row + j;

                if (nCol < 0 || nCol >= this._matrixSize || nRow < 0 || nRow >= this._matrixSize) {
                    continue;
                }

                if (nCol === col && nRow === row) {
                    continue;
                }

                neighbours.push(this._nodeMatrix[nCol][nRow]);
            }
        }

        return neighbours;
    }

    public gameOver(win) {
        this._isOver = true;
        this._timer.stop();

        this.status.setStatus(win ? Status.Win : Status.Fail);
        if (win) {
            this.setStats(this._timer.getSecStr());
        }

        for (let i = 0; i < this._matrixSize; i++) {
            for (let j = 0; j < this._matrixSize; j++) {
                const cell = this._nodeMatrix[i][j];
                if (cell.hasMine) {
                    cell.reveal();
                }
            }
        }
    }

    private _isOver: boolean = false;

    public isOver(): boolean {
        return this._isOver;
    }

    public restart() {
        this._isOver = false;
        this._generatedMineCount = 0;
        for (let i = 0; i < this._matrixSize; i++) {
            for (let j = 0; j < this._matrixSize; j++) {
                const cell = this._nodeMatrix[i][j];
                cell.reset();
            }
        }

        this.generateMines();
        this.status.setStatus(Status.Running)
        this.clearStats();
    }

    public getMineCount(cell: MineCell): number {
        let count = 0;

        const neighbours = this.getNeighbours(cell);
        for (const neighbour of neighbours) {
            if (neighbour.hasMine) {
                count++;
            }
        }

        return count
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

        this._timer.start();
    }

    getCell(col: number, row: number) {
        return this._nodeMatrix[col][row];
    }

    update(deltaTime: number) {
        
    }
}


