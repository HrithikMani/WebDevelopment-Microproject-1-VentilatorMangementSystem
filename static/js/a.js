$.get("getDe/",function(data){
    var a = data;
    $("#cosmo").html(a);
    
});
$()
function p(a){
    $.get("/delete",{id:a},function(data){
        if(data == "Deleted"){
            location.reload();
        }
    }); 
}

function y(a){
    $.get("/add",{id:a},function(data){
            location.reload();
    }); 
}

function z(a,b){
    if(b == false){
        x = 1;
        $.get("/update",{id:a,setTo:x},function(data){
            location.reload();
        }); 
    }
    if(b == true){
        x=0;
        $.get("/update",{id:a,setTo:x},function(data){
            location.reload();
        }); 
    }
}

$('#sub').click(function(){
    var b = $("#searchTx").val();
    $.get("/search",{name:b},function(data){
        if(data == "No hospitals found with that name!"){
            alert(data);
        }else{
            $("#cosmo").html(data);
        }
    });
});

$('#addHos').click(function(e){
    e.preventDefault();
    var b = prompt("Enter name");
    $.get("/addHos",{name:b},function(data){
        location.reload();
    });
});
