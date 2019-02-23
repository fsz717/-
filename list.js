var url = 'http://127.0.0.1:666/positions/getList';
var str = '';
function getAjax(url, key, callback) {
    $.get(url, function (json) {
        if (json.listAll) {
            var len = json.listAll.length;
            var len1 = json.count;
            str = ''
            if (key) {
                len = json.nums;
            }
            if (len != 0) {
                if ($('tbody').children().length != 0) {
                    $('tbody').html("");
                }
                create(json.list)
                $("tbody").append(str)
                if ($('.page').children().length == 0) {
                    createPage(len, len1)
                }
            }
            if (callback) {
                callback()
            }
        } else {
            $('tbody').html("");
        }
    })
}
function createPage(len, len1) {
    var page = (len > len1) ? Math.ceil(len / len1) : 1;
    var str1 = `<p class='sigle_p'>`;
    for (var i = 0; i < page; i++) {
        str1 += `
                            <span>${i + 1}</span>
                        `
    }
    str1 += `</p><p>最多显示<span>${page}</span>页</p>`
    $(".page").append(str1)
}
function create(arr) {
    arr.forEach((element, ind) => {
        str += `<tr>`;
        $(element).each((ind, ele) => {
            str += `
            <td>${ele.tokenId}</td>
            <td><img src="${ele.companyLogo}" style='width:50px;'></td>
            <td>${ele.positionName}</td>
            <td>${ele.city}</td>
            <td>${ele.salary}</td>
            <td>${ele.degree}</td>
            <td>${ele.type}</td>
            <td>${ele.experience}</td>
            <td>${ele.description}</td>
            <td>${ele.companyName}</td>
            <td>${ele.createTime}</td>
            <td class=' operate' id='${ele.tokenId}'><a class='edit'>编辑</a><a class='del'>删除</a></td>
            `
        })
        str += `</tr>`
    });
}

getAjax(url, "", function () {
    $(".page span:first").addClass('select')
});

$('.page').on("click", '.sigle_p span', function () {
    p_ind = $(this).text();
    $(this).addClass('select').siblings().removeClass('select')
    var url1 = url + '?page=' + p_ind
    if ($('.txt').val() != "") {
        url1 += '&key=' + $('.txt').val()
        getAjax(url1, $('.txt').val());
    } else {
        getAjax(url1);
    }

})

$('#search').on('click', 'input[type=button]', function () {
    if ($(this).val() == "搜索") {
        $('.page').html("")
        var text = $('.txt').val();
        var url2 = url + '?key=' + text;
        getAjax(url2, text, function () {
            $(".page span:first").addClass('select')
        });
    }
    if ($(this).val() == "添加") {
        $(".box").fadeIn(100);
        $(".submit").click(function(){
            doUpload('http:/127.0.0.1:666/positions/add')
        })
    }
})

//点击添加数据的按钮函数

//实现上传文件，并且不刷新页面
function doUpload(url,id) {  
    var formData = new FormData($( "#uploadForm")[0]);  
    if(id){
        //formData.append("tokenId",id) ;
        //使用append添加时formdata的key若已存在，则不能重复添加，会忽略本次append操作，这在对于使用经常需要表单取出值是相当不利的，所以建议使用set方法来添加新的key-value值，set的意思是修改一个已经存在的键值对，如果不存在的话就创建一个。即
        formData.set("tokenId",id);
    }
    $.ajax({  
         url: url,  
         type: 'POST',  
         data: formData,  
         async: false,  
         cache: false,  
         contentType: false,  // 不设置内容类型
         processData: false,  //不处理数据
         success: function (returndata) {  
             if(returndata.status){
                 alert(returndata.msg)
                 $(".box").find("input[type=text]").val("");
                 $(".box").fadeOut(100);
                 history.go(0)
             }else{
                alert(returndata.msg)
             } 
         },  
         error: function (returndata) {  
             alert(returndata);  
         }  
    });  
}
//删除
$("tbody").on('click', '.del', function () {
    var id = $(this).parent().attr("id")
    if (confirm("你是否确定删除该条数据")) {
        //老写法
        // $.get("http://127.0.0.1:666/positions/del?tokenId=" + id)
        //restful风格
        $.get("http://127.0.0.1:666/positions/del/" + id)
        $(this).parent().parent().remove()
        history.go(0)
    }
})
//编辑
$('tbody').on("click", '.edit', function () {
    var id = $(this).parent().attr("id");
    console.log(id)
    fetch("http://127.0.0.1:666/positions/getList?tokenId="+id)
            .then(body => body.json())
            .then(res => {
                $(".box").fadeIn(100);
                return res;
            })
            .then((obj)=>{
                var obj1=obj.list[0]
                $('.t1').val(obj1.positionName)
                $('.t2').val(obj1.city)
                $('.t3').val(obj1.salary)
                $('.t4').val(obj1.degree)
                $('.t5').val(obj1.type)
                $('.t6').val(obj1.experience)
                $('.t7').val(obj1.description)
                $('.t8').val(obj1.companyName)
            })
    $(".submit").click(function () {
        doUpload("http://127.0.0.1:666/positions/update", Number(id));
    })
})
$(".btn_del").click(function(){
    $(".box").fadeOut(100);
})



