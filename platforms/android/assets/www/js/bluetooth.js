/**
 * Created by Bin on 2015/4/17.
 */
/* 名词解释
* RSSI ：接收的信号强度指示
* */

var app = {
    initialize: function(){
        this.bindEvents();
    },
    bindEvents: function(){
        document.addEventListener('deviceready', this.onDeviceReady, false);
        this.connect();
        this.openSetting();
        this.discoverUnpaired();
    },
    onDeviceReady: function(){
        bluetoothSerial.isEnabled(app.getBluetooth, function() {
            app.enableBluetooth();
        });
    },
    enableBluetooth: function(){
        $('#disabled_js').removeClass('hide');
        bluetoothSerial.enable(function(){
            app.getBluetooth();
            $('#disabled_js').addClass('hide');
            $('#enabled_js').removeClass('hide');
        }, function(){

        });
    },
    getBluetooth: function(){
        var tpl = $('#device_tpl').html();
        bluetoothSerial.list(function(devices) {
            if(devices.length){
                $('#devices_js').html($.tpl(tpl, {devices: devices}));
                app.isConnected();
            }else{
                $('#no_device_js').show();
            }
        }, function(){

        });
    },
    isConnected: function(){
        bluetoothSerial.isConnected(
            function(data) {
                $('#is_connected_js').removeClass('hide').html('<i></i>已连接');
                $.tips({
                    content: data.toString(),
                    stayTime: 1500
                });
            },
            function() {
                $('#is_connected_js').removeClass('hide').html('<i></i>蓝牙设备未连接');
            }
        );
    },
    discoverUnpaired: function(){
        $('#scan_js').on('click', function(){
            var tpl = $('#device_tpl').html();
            $('#scanning_js').removeClass('hide');
            bluetoothSerial.discoverUnpaired(function(devices){
                $('#scanning_js').addClass('hide');
                if(devices.length){
                    $('#unpaired_devices_js').html($.tpl(tpl, {devices: devices}));
                }else{
                    $('#no_unpaired_js').html('未在附近找到蓝牙设备');
                }
            }, function(){
                $('#scanning_js').addClass('hide');
            });
        });
    },
    connect: function(){

        //连接蓝牙设备
        $('#devices_js').on('click', 'li', function(){
            var $el = $(this);
            var loader = $.loading({
                content:'连接中...'
            });

            bluetoothSerial.connect($el.find('p').text(), function(){
                $el.find('.ui-list-action').text('已连接');
                loader.loading("hide");
                $.tips({
                    content: '连接成功',
                    type: 'success',
                    stayTime: 1500
                });
            }, function(){
                loader.loading("hide");
                $.tips({
                    content: '连接失败',
                    stayTime: 1500
                });
            });
        });
    },
    openSetting: function(){
        $('#open_setting_js').on('click', function(){
            bluetoothSerial.showBluetoothSettings(function(){

            }, function(){

            });
        })
    }
};

app.initialize();