Tree = {
    //存储父结点的名称，用于判断
    InitParentData: function (L2Data) {
        L2 = L2Data;
    },

	//初始化树
    InitTree: function (treeData, rootName) {

        $(rootName).treeview({ data: tree, showCheckbox: true, selectedBackColor: "#A1DEEC" });


        $(rootName).on('nodeChecked', function (event, node) {
            Tree.CheckChildren(node, rootName);
            var parent = $(rootName).treeview('getParent', node.nodeId);
            Tree.CheckParent(parent, rootName);
        });
        $(rootName).on('nodeUnchecked', function (event, node) {
            Tree.UnCheckChildren(node, rootName);
            var parent = $(rootName).treeview('getParent', node.nodeId);
            Tree.UnCheckParent(parent, rootName);
        });
    },
	
    //获取所有选中的结点id
    GetCheckedNode: function (rootName) {
        var treeRoot = $(rootName).treeview('getChecked');
        for (var p in treeRoot) {
            if (treeRoot[p].id != null)
                if (treeRoot[p].nodes == null)
                    checkNodes.push(treeRoot[p].id);
        }
    },

    //设置数据中匹配的结点选中
    SetChecked: function (rootName,limitArray) {
        var nodes = $(''+rootName+' >ul>li');

        for (var i = 0; i < nodes.length; i++) {
            var p = nodes[i];
            var nodeId = p.attributes[1].nodeValue;
            for (var j = 0; j < L2.length; j++) {
				//与最顶层结点名称一致
                if (p.innerText == L2[j]) {
                    var parent = $(rootName).treeview("getNode", nodeId);
                    Tree.SetNodeChecked(rootName,parent, limitArray);
                }
            }
        }
    },

    SetNodeChecked: function (rootName,node, limitArray) {
        var childNode = node;
        if (node.nodes != null) {
            for (var i = 0; i < node.nodes.length; i++) {
                Tree.SetNodeChecked(node.nodes[i], limitArray);
            }
        } else {
            for (var j = 0; j < limitArray.length; j++) {
                if (childNode.id == limitArray[j]) {
                    $(rootName).treeview('checkNode', [childNode.nodeId]);
                    break;
                }
            }
        }
    },

    //联动选中子结点
    CheckChildren: function (node, rootName) {
        if (node.nodes == null) {
            return;
        }
        for (var i = 0; i < node.nodes.length; i++) {
            var currentNode = node.nodes[i];
            $(rootName).treeview('checkNode', [currentNode.nodeId, { silent: true }]);
            Tree.CheckChildren(currentNode, rootName);
        }
    },

    //联动选中父结点
    CheckParent: function (parentNode, rootName) {
        if (parentNode.selector == rootName) {
            return;
        }
        var allChildrenChecked = true;
        for (var i = 0; i < parentNode.nodes.length; i++) {
            if (parentNode.nodes[i].state.checked) {
                Tree.HalfCheckParent(parentNode, rootName);
            }
            allChildrenChecked = allChildrenChecked && parentNode.nodes[i].state.checked
        }
        if (allChildrenChecked) {
            $(rootName).treeview('checkNode', [parentNode, { silent: true }]);
        }

        var parent = $(rootName).treeview('getParent', parentNode);
        if (parent.selector != rootName) {
            Tree.CheckParent(parent, rootName);
        }
    },

    //联动取消选中子结点
    UnCheckChildren: function (node, rootName) {
        if (node.nodes == null) {
            return;
        }

        for (var i = 0; i < node.nodes.length; i++) {
            var currentNode = node.nodes[i];
            $(rootName).treeview('uncheckNode', [currentNode.nodeId, { silent: true }]);
            Tree.UnCheckChildren(currentNode, rootName);
        }
    },

    //联动取消选中父结点
    UnCheckParent: function (parentNode, rootName) {
        if (parentNode.selector == rootName) {
            return;
        }

        var oneChildChecked = false;
        for (var i = 0; i < parentNode.nodes.length; i++) {
            if (!parentNode.nodes[i].state.checked) {
                $(rootName).treeview('uncheckNode', [parentNode, { silent: true }]);
            }
            oneChildChecked = oneChildChecked || parentNode.nodes[i].state.checked
        }

        var parent = $(rootName).treeview('getParent', parentNode);
        if (parent.selector != rootName) {
            Tree.UnCheckParent(parent, rootName);
        }

        if (oneChildChecked) {
            Tree.HalfCheckParent(parentNode, rootName);
        }
    },

    //半选
    HalfCheckParent: function (parentNode, rootName) {
        if (parentNode.selector == rootName) {
            return;
        }
        $(rootName).treeview('halfCheckNode', [parentNode, { silent: true }]);
        var parent = $(rootName).treeview('getParent', parentNode);
        Tree.HalfCheckParent(parent,rootName);
    }
}