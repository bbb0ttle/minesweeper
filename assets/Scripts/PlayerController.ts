import { _decorator, Component, EventMouse, Input, input, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export const BLOCK_SIZE = 40; // 添加一个放大比

@ccclass('NewComponent')
export class NewComponent extends Component {
    start() {
        input.on(Input.EventType.MOUSE_UP, this.onMouseUp, this)
    }

    private _startJump: boolean = false;
    private _jumpStep: number = 0;
    private _curJumpTime: number = 0;
    private _jumpTime: number = 0.1;
    private _curJumpSpeed: number = 0;
    private _curPos: Vec3 = new Vec3();
    private _deltaPos: Vec3 = new Vec3(0, 0, 0);
    private _targetPos: Vec3 = new Vec3();

    onMouseUp(event: EventMouse) {
        console.log('Mouse up', event.getLocation());
        let isLeft = event.getButton() === EventMouse.BUTTON_LEFT;
        let isRight = event.getButton() === EventMouse.BUTTON_RIGHT;


        if (isLeft) {
            console.log('Left click');
            this.jumpByStep(1);
            return;
        }

        if (isRight) {
            console.log('Right click');
            this.jumpByStep(2);
            return;
        }
    }

    jumpByStep(step: number) {
        if (this._startJump) {
            return;
        }

        this._startJump = true;
        this._jumpStep = step;
        this._curJumpTime = 0;
        this._curJumpSpeed = this._jumpStep * BLOCK_SIZE / this._jumpTime;
        this.node.getPosition(this._curPos);

        Vec3.add(this._targetPos, this._curPos, new Vec3(this._jumpStep * BLOCK_SIZE, 0, 0));

    }

    update(deltaTime: number) {
        if (!this._startJump) {
            return;
        }

        this._curJumpTime += deltaTime; // 累计总的跳跃时间
        if (this._curJumpTime > this._jumpTime) { // 当跳跃时间是否结束
            // end
            this.node.setPosition(this._targetPos); // 强制位置到终点
            this._startJump = false;               // 清理跳跃标记
        } else {
            // tween
            this.node.getPosition(this._curPos);
            this._deltaPos.x = this._curJumpSpeed * deltaTime; //每一帧根据速度和时间计算位移
            Vec3.add(this._curPos, this._curPos, this._deltaPos); // 应用这个位移
            this.node.setPosition(this._curPos); // 将位移设置给角色
        }
    }
}


