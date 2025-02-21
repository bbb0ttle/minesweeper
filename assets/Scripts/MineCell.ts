import { _decorator, Component, RichText, Node, Color, Graphics } from 'cc';
import {CellState} from "db://assets/Scripts/types/cell";
const { ccclass, property } = _decorator;

@ccclass('MineCell')
export class MineCell extends Component {
    start() {
        this.initSubStateUI();
        this.initNormalCellUI();
        this.state = CellState.Normal;
    }

    private _state= CellState.Normal;
    public get state() {
        return this._state;
    }
    public set state(value) {
        this._state = value;
        this.changeStateUI(value);
    }

    public _hasMine = false;
    public get hasMine() {
        return this._hasMine;
    }
    public set hasMine(value) {
        this._hasMine = value;
    }

    public setNumber(number: number) {
        if (this.state !== CellState.Number) {
            return;
        }

        const numNode = this.getSubStateUI(CellState.Number);
        const valNode = numNode.getChildByName("val")
        const richText = valNode.getComponent(RichText);

        // set number
        richText.string = number.toString();
    }

    changeStateUI(state: CellState) {
        for (let key in this._stateUIDict) {
           this._stateUIDict[key].active = false;
        }

        this._stateUIDict[state].active = true;
    }

    private _stateUIDict = {
    }

    initSubStateUI() {
        this._stateUIDict[CellState.Normal] = this.node.getChildByName('normal');
        this._stateUIDict[CellState.Number] = this.node.getChildByName('number');
        this._stateUIDict[CellState.Mine] = this.node.getChildByName('bomb');
        this._stateUIDict[CellState.Flag] = this.node.getChildByName('flag');
    }

    getSubStateUI(state: CellState): Node {
        return this._stateUIDict[state];
    }

    initNormalCellUI() {
        // stroke border
        const normalNode = this.getSubStateUI(CellState.Normal);

        let graphics = normalNode.getComponent(Graphics);

        graphics.lineWidth = 3;
        graphics.strokeColor = Color.BLACK;
        graphics.rect(-25, -25, 50, 50);
        graphics.stroke();
    }

    update(deltaTime: number) {
        
    }
}


