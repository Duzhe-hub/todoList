$(function () {
    // 打开页面时先加载一次避免出现空页面
    load();

    // 绑定事件 按下回车时将完整数据存储到浏览器本地存储中
    $("#title").on("keydown", function (e) {
        // 13 是回车键的 ASCII 码
        if (e.keyCode === 13) {
            if ($(this).val() == "") {
                alert("任务不能为空!");
            } else {
                // 先读取浏览器本地存储中已存储的数据
                var local = getDate();
                // 对 local 数组进行更新数据，将最新的数据追加给 local 数组 .push() 对数组进行追加数据
                local.push({ title: $(this).val(), done: false });
                // 将更新后的数据再次保存到浏览器本地存储中
                saveDate(local);
                // 更新后加载数据
                load();
                // 存储完成后将文本框清空
                $(this).val("");
            }
        }
    });

    // 删除操作
    $("ol, ul").on("click", "a", function () {
        // 获取浏览器本地存储中已存储的数据
        var data = getDate();
        // 修改数据
        // 因为各个 a 标签之间的关系不是同级元素，所以无法使用 index 直接获取索引，而是创建一个自定义属性来分别
        // 如果直接删除 a 标签的父元素 li，这样也无法删除掉数组中的属性，所以需要使用数组的删除方法去删除数组中的元素
        // splice(开始位置, 删除数量);
        // 首先获取自定义属性
        var index = $(this).attr("id");
        // 从自定义属性中返回的值(各个元素的下标)开始删除，删除数量为一个元素(删除当前元素)
        data.splice(index, 1);
        // 将修改后的数据保存到浏览器本地存储中(避免刷新后数据恢复)
        saveDate(data);
        // 重新渲染页面(视图更新)
        load();
    });

    // toDoList 正在进行和已完成选项操作
    $("ol, ul").on("click", "input", function () {
        // 获取浏览器本地存储中已存储的数据
        var data = getDate();
        // 修改数据 
        // 获取 input 的同级元素 a 的索引属性
        var index = $(this).siblings("a").attr("id");
        // 通过 a 的索引属性找到 input (都是 li 的子元素且一个 li 中有一个 input 和 a)
        data[index].done = $(this).prop("checked");
        // 将修改后的数据保存到浏览器本地存储中
        saveDate(data);
        // 重新渲染页面
        load();
    });

    // 获取浏览器本地存储中已存储的数据
    function getDate() {
        // 获取浏览器本地存储中已存储的数据
        var data = localStorage.getItem("todolist");
        // 判断是否获取到数据
        if (data !== null) {
            // 如果获取数据则返回成数组对象
            return JSON.parse(data);
        } else {
            // 否则返回空数组
            return [];
        }
    }
    // 保存数据到浏览器本地存储中
    function saveDate(data) {
        // 将要保存的数据转换成字符串类型再存储到浏览器本地存储中
        localStorage.setItem("todolist", JSON.stringify(data));
    }

    // 渲染加载数据
    function load() {
        // 获取浏览器本地存储中的数据
        var data = getDate();
        // 遍历数据前需要先将原数据清空，避免出现与上次数据重复
        $("ol, ul").empty();
        // 正在进行的任务个数
        var todoCount = 0;
        // 已完成的任务个数
        var doneCount = 0;
        // 遍历数据，将数据获取出来，动态创建 li 存放数据
        $.each(data, function (i, data) {
            if (data.done) {
                $("ul").prepend("<li> <input type='checkbox' checked='checked'> <p>" +
                    data.title + "</p> <a href='javascript:;' id=" + i + "></a> </li>");
                    doneCount++;
            } else {
                $("ol").prepend("<li> <input type='checkbox'> <p>" +
                    data.title + "</p> <a href='javascript:;' id=" + i + "></a> </li>");
                    todoCount++;
            }
        });
        // 修改正在进行的任务个数
        $("#todocount").text(todoCount);
        // 修改已完成的任务个数
        $("#donecount").text(doneCount);
    }

});