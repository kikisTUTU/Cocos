let Physics = {
    // 判断是否为区域碰撞检测
    isColliderAttached(target) {
        if (target.getComponent("cc.BoxCollider") != null) {
            return true;
        }

        if (target.getComponent("cc.CircleCollider") != null) {
            return true;
        }

        if (target.getComponent("cc.PolygonCollider") != null) {
            return true;
        }

        return false;
    }
};

module.exports = Physics;