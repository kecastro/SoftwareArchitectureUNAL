"use strict";
var app = angular.module('SoftwareArchitectureUNAL', ['ngRoute', 'ngMaterial']);

app.controller('NavigationController', ['$scope', '$http', '$location', '$timeout', function ($scope, $http, $location, $timeout) {
    $scope.user = null;
    $scope.credentials = {};
    $scope.success = false;
    $scope.error = false;

    $scope.me = function () {
        $http.get('auth/me')
            .then(function (response) {
                $scope.user = response.data;
            }, function () {
                $location.path('/');
                $scope.user = null;
            });
    };
    $scope.login = function () {
        $http.post('auth/login', $scope.credentials)
            .then(function (response) {
                $scope.success = true;
                $scope.error = false;
                $scope.credentials = {};
                $scope.user = response.data;
                $timeout(function () {
                    $("#login").modal("hide");
                }, 1000);
            }, function () {
                $scope.success = false;
                $scope.error = true;
                $scope.credentials = {};
            });
    };
    $scope.logout = function () {
        $http.post('auth/logout', {})
            .then(function () {
                $scope.user = null;
            });
    };

    $scope.me();
}]);

app.controller('UserController', ['$scope', '$http', function ($scope, $http) {
    $scope.user = {};
    $scope.success = false;
    $scope.error = false;

    $scope.me = function () {
        $http.get('auth/me')
            .then(function (response) {
                $scope.user = response.data;
            }, function () {
                $scope.user = {};
            });
    };
    $scope.submit = function () {
        $http.put('users/' + $scope.user.id, $scope.user)
            .then(function (response) {
                $scope.success = true;
                $scope.error = false;
                $scope.user = response.data;
            }, function () {
                $scope.success = false;
                $scope.error = true;
                $scope.me();
            });
    };

    $scope.me();
}]);

app.controller('HomeController', ['$scope', '$http', function ($scope, $http) {
}]);

app.controller('AdminController', ['$scope', '$http', function ($scope, $http) {
}]);

app.controller('MaterialController', ['$scope', '$http', function ($scope, $http) {
    $scope.materials = {};
    $scope.material = {};

    const URI = 'materials';
    const MODAL = '#material';
    const RAW = "Materia Prima";
    const SUPPLY = "Insumo";

    $scope.reload = function () {
        $http.get(URI)
            .then(function (response) {
                $scope.materials = response.data;
                for (var m in $scope.materials) {
                    if ($scope.materials[m].supply)
                        $scope.materials[m].type = SUPPLY;
                    else
                        $scope.materials[m].type = RAW;
                }
            });
    };
    $scope.edit = function (material) {
        $scope.material = material;

        if ($scope.material.rawMaterial)
            $scope.material.selectedType = "raw";
        else
            $scope.material.selectedType = "supply";

        $(MODAL).modal('show');
    };
    $scope.submit = function () {
        if ($scope.material.selectedType === "raw") {
            $scope.material.rawMaterial = true;
            $scope.material.supply = false;
            $scope.material.type = RAW;
        } else {
            $scope.material.rawMaterial = false;
            $scope.material.supply = true;
            $scope.material.type = SUPPLY;
        }

        if ($scope.material.id)
            $http.put(URI + '/' + $scope.material.id, $scope.material)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
        else
            $http.post(URI, $scope.material)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
    };
    $scope.delete = function (material) {
        $http.delete(URI + '/' + material.id)
            .then(function () {
                $scope.reload();
            });
    };

    $scope.reload();
}]);

app.controller('ProductsController', ['$scope', '$http', function ($scope, $http) {
    $scope.products = {};
    $scope.product = {};

    const URI = 'products';
    const MODAL = '#product';

    $scope.reload = function () {
        $http.get(URI)
            .then(function (response) {
                $scope.products = response.data;
            });
    };
    $scope.edit = function (product) {
        $scope.product = product;
        $(MODAL).modal('show');
    };
    $scope.submit = function () {
        if ($scope.product.id)
            $http.put(URI + '/' + $scope.product.id, $scope.product)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
        else
            $http.post(URI, $scope.product)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
    };
    $scope.delete = function (product) {
        $http.delete(URI + '/' + product.id)
            .then(function () {
                $scope.reload();
            });
    };

    $scope.reload();
}]);


app.controller('SalesController', ['$scope', '$http', '$filter', function ($scope, $http, $filter) {
    $scope.sales = {};
    $scope.sale = {};
    $scope.user = {};
    $scope.products = {};
    $scope.quantity = 0;
    $scope.selected = {};

    const URI = 'sales';
    const MODAL = '#sales';

    $scope.getUser = function () {
        $http.get('auth/me')
            .then(function (response) {
                $scope.user = response.data;
            });
    };

    $scope.reload = function () {
        $scope.getUser();
        $scope.uriUser = ($scope.user.salesman) && !($scope.user.admin) ? '/seller/'+$scope.user.id : '';
        $http.get(URI + $scope.uriUser)
            .then(function (response) {
                $scope.sales = response.data;
            });
    };

    $scope.getProducts = function () {
        $http.get('products')
            .then(function (response) {
                $scope.products = response.data;
            });
    };

    $scope.getSaleDetails = function(){
        $http.get(URI + "/"+ $scope.sale.id)
            .then(function (response) {
                $scope.sale = response.data;
            });

    };

    $scope.detail = function (sale) {
        $scope.sale = sale;
        $scope.getProducts();
        $scope.getSaleDetails();
        $scope.quantity = 0;
        $scope.selected = {};
        $scope.selected.inventory = 1000;
        $('#detail').modal('show');
    };
    $scope.addProduct = function (){

        $scope.saleDetail = {
            "id": 0,
            "product": $scope.selected,
            "quantity": $scope.quantity,
            "price": ($scope.selected.price * $scope.quantity)
        };

        $http.post(URI + '/SaleDetail/' + $scope.sale.id, $scope.saleDetail)
            .then(function () {
                $scope.getProducts();
                $scope.reload();
                $scope.getSaleDetails();
            });

        $scope.selected.inventory = $scope.selected.inventory - $scope.quantity;
        $http.put('products' + '/' + $scope.selected.id, $scope.selected)
            .then(function () {
                $scope.reload();
                $scope.getProducts();
                $scope.getSaleDetails();
            });

    };

    $scope.new = function () {
        $scope.sale = {"id" : 0, "client" : "", "seller" : $scope.user};
        $scope.sale.date = $filter('date')(new Date(), "yyyy-MM-dd");
        $scope.option = false;
        $(MODAL).modal('show');
    };

    $scope.edit = function (sale) {
        $scope.sale = sale;
        $scope.sale.date = $filter('date')($scope.sale.date, "yyyy-MM-dd");
        $scope.option = true;
        $(MODAL).modal('show');
    };
    $scope.submit = function () {
        $scope.sale.date = $scope.sale.date + "T05:00:00.000Z";
        if( $scope.option ) {
            $http.put(URI + '/' + $scope.sale.id, $scope.sale)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
        }else{
            $http.post(URI, $scope.sale)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
        }
    };

    $scope.delete = function (id) {
        $http.delete(URI + '/' + id)
            .then(function () {
                $scope.reload();
            });
    };
    $scope.reload();
}]);

app.controller('CreditsController', ['$scope', '$http', function ($scope, $http) {
    $scope.credits = {};
    $scope.credit = {};

    const URI = 'credits';
    const MODAL = '#credit';

    $scope.reload = function () {
        $http.get(URI)
            .then(function (response) {
                $scope.credits = response.data;
            });
    };
    $scope.edit = function (credit) {
        $scope.credit = credit;
        $(MODAL).modal('show');
    };
    $scope.submit = function () {
        if ($scope.credit.id)
            $http.put(URI + '/' + $scope.credit.id, $scope.credit)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
        else
            $http.post(URI, $scope.credit)
                .then(function () {
                    $(MODAL).modal('hide');
                    $scope.reload();
                });
    };
    $scope.delete = function (credit) {
        $http.delete(URI + '/' + credit.id)
            .then(function () {
                $scope.reload();
            });
    };

    $scope.reload();
}]);


app.controller('StatisticsController', ['$scope', '$http', function ($scope, $http) {
    $scope.sales = {};
    $scope.sale = {};

    const URI = 'stats';
    const MODAL = '#details';

    $scope.date = new Date();

    $scope.minDate = new Date(
        $scope.date.getFullYear(),
        $scope.date.getMonth() - 2,
        $scope.date.getDate());

    $scope.maxDate = $scope.date;

    $scope.edit = function (sale) {
        $scope.sale = sale;
        $(MODAL).modal('show');
    };

    $scope.reload = function(){
        var date = $scope.date.getFullYear()+"-"+($scope.date.getMonth()+1)+"-"+$scope.date.getDate();
        console.log(date);
        console.log($scope.date);
        $http.get("sales/stats/"+date)
            .then( function(response) {
                $scope.sales = response.data;
                console.log($scope.sales);
            });
    }
}]);

app.controller('ProductionController', ['$scope', '$http', function ($scope, $http) {
}]);

app.controller('controlUsersController', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.allUsers = {};
    $scope.userPassword = {password: ""};
    $scope.typeUser = "";
    $scope.existUser = false;
    $scope.checkPassword = "";

    $scope.submit = function () {
        $http.get('users/' + $scope.userPassword.user.username)
            .then(function (userResponse) {
                $scope.existUser = userResponse.status === 200;
                if (!$scope.existUser) {
                    $scope.userPassword.user.admin = ($scope.typeUser === "admin");
                    $scope.userPassword.user.worker = ($scope.typeUser === "worker");
                    $scope.userPassword.user.salesman = ($scope.typeUser === "salesman");
                    $http.post('users', $scope.userPassword)
                        .then(function (response) {
                            if (response.status === 200) {
                                alert("El usuario se creo correctamente")
                                $scope.newuser.$setPristine();
                                $scope.userPassword = {password: ""};
                                $scope.typeUser = "";
                                $scope.checkPassword = "";
                            } else {
                            }
                        });
                }
            });

    }
    $scope.getUsers = function () {
        $http.get('users')
            .then(function (response) {
                if (response.status === 200) {
                    //console.log(response.data);
                    $scope.allUsers = response.data;

                    $scope.columns = [
                        {title: 'Borrar', field: 'delete', visible: true},
                        {title: 'Id', field: 'id', visible: true},
                        {title: 'Nombre', field: 'name', visible: true},
                        {title: 'Nombre de usuario', field: 'username', visible: true},
                        {title: 'Correo electronico', field: 'email', visible: true},
                        {title: 'Cuenta de administrador', field: 'isAdmin', visible: true},
                        {title: 'Cuenta de empleado', field: 'isWorker', visible: true},
                        {title: 'Cuenta de vendedor', field: 'isSalesman', visible: true}
                    ];

                }
                else {

                }
            });
    }
}]);

app.config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
    $routeProvider
        .when('/', {
            templateUrl: 'partials/home.html',
            controller: 'HomeController'
        })
        .when('/me', {
            templateUrl: 'partials/me.html',
            controller: 'UserController'
        })
        .when('/admin', {
            templateUrl: 'partials/admin.html',
            controller: 'AdminController'
        })
        .when('/materials', {
            templateUrl: 'partials/materials.html',
            controller: 'MaterialController'
        })
        .when('/products', {
            templateUrl: 'partials/products.html',
            controller: 'ProductsController'
        })
        .when('/users', {
            templateUrl: 'partials/users.html',
            controller: 'controlUsersController'
        })
        .when('/credits', {
            templateUrl: 'partials/credits.html',
            controller: 'CreditsController'
        })
        .when('/sales', {
            templateUrl: 'partials/sales.html',
            controller: 'SalesController'
        })
        .when('/production', {
            templateUrl: 'partials/production.html',
            controller: 'ProductionController'
        })
        .when('/sales', {
            templateUrl: 'partials/sales.html',
            controller: 'SalesController'
        })

        .when('/statistics', {
            templateUrl: 'partials/statistics.html',
            controller: 'StatisticsController'
        })

        .otherwise({redirectTo: '/'});

    //html5mode causes several issues when the front end is embedded with the web service.
    //$locationProvider.html5Mode(true);
    $locationProvider.hashPrefix('!');
}]);
