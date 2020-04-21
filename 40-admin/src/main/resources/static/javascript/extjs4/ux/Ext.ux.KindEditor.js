
Ext.define('Ext.ux.KindEditor', {
    extend: 'Ext.form.field.TextArea',
    alias: 'widget.kindeditor_', //xtype����
    initComponent: function () {
        //alert(this.basePath);
        this.html = "<textarea id='" + this.getId() + "-input' name='" + this.name + "'></textarea>";
        this.callParent(arguments);
        this.on("boxready", function (t) {
            this.inputEL = Ext.get(this.getId() + "-input");
            this.editor = KindEditor.create('textarea[name="' + this.name + '"]', {
                height: t.getHeight() - 18, //�еױ߸߶ȣ���Ҫ��ȥ
                width: t.getWidth() - t.getLabelWidth(), //�����Ҫ��ȥlabel�Ŀ��
                //                 basePath: '/Content/Plugin/kindeditor-4.1.5/',
                //                 uploadJson: '/Content/Plugin/kindeditor-4.1.5/asp.net/upload_json.ashx',//·���Լ���һ��
                //                 fileManagerJson: '/Content/Plugin/kindeditor-4.1.5/asp.net/file_manager_json.ashx',//·���Լ���һ��
                resizeType: 0,
                wellFormatMode: true,
                newlineTag: 'br',
                allowFileManager: true,
                allowPreviewEmoticons: true,
                //                 items: [
                //                     'source', '|', 'undo', 'redo', '|', 'justifyleft', 'justifycenter', 'justifyright',
                //                     'justifyfull', 'insertorderedlist', 'insertunorderedlist', '|',
                //                     'formatblock', 'fontname', 'fontsize', '|', 'forecolor', 'bold',
                //                     'italic', 'underline', 'lineheight', '|', 'image', 'multiimage',
                //                     'table', 'emoticons',
                //                     'link', 'unlink', 'fullscreen'
                //                 ],
                allowImageUpload: true
            });
        });
        this.on("resize", function (t, w, h) {
            this.editor.resize(w - t.getLabelWidth() - 2, h);
        });
    },
    setValue: function (value) {
        if (this.editor) {
            this.editor.html(value);
        }
    },
    reset: function () {
        if (this.editor) {
            this.editor.html('');
        }
    },
    setRawValue: function (value) {
        if (this.editor) {
            this.editor.text(value);
        }
    },
    getValue: function () {
        if (this.editor) {
            return this.editor.html();
        } else {
            return ''
        }
    },
    getRawValue: function () {
        if (this.editor) {
            return this.editor.text();
        } else {
            return ''
        }
    }
});

Ext.define('App.ux.KindEditor', {
    extend: 'Ext.form.field.Text',
    alias: ['widget.kindeditor'],
    alternateClassName: 'Ext.form.KindEditor',
    fieldSubTpl: [
        '<textarea id="{id}" {inputAttrTpl}',
            '<tpl if="name"> name="{name}"</tpl>',
            '<tpl if="rows"> rows="{rows}" </tpl>',
            '<tpl if="cols"> cols="{cols}" </tpl>',
            '<tpl if="placeholder"> placeholder="{placeholder}"</tpl>',
            '<tpl if="size"> size="{size}"</tpl>',
            '<tpl if="maxLength !== undefined"> maxlength="{maxLength}"</tpl>',
            '<tpl if="readOnly"> readonly="readonly"</tpl>',
            '<tpl if="disabled"> disabled="disabled"</tpl>',
            '<tpl if="tabIdx"> tabIndex="{tabIdx}"</tpl>',
    //            ' class="{fieldCls} {inputCls}" ',
            '<tpl if="fieldStyle"> style="{fieldStyle}"</tpl>',
            ' autocomplete="off">\n',
            '<tpl if="value">{[Ext.util.Format.htmlEncode(values.value)]}</tpl>',
        '</textarea>',
        {
            disableFormats: true
        }
    ],
    kindeditorConfig: {},
    initComponent: function () {
        var me = this;
        me.callParent(arguments);
    },
    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        if (!me.ke) {
            me.ke = KindEditor.create("#" + me.getInputId(), Ext.apply(me.kindeditorConfig, {
                height: me.height,
                width: '100%',
                afterCreate: function () {
                    me.KindEditorIsReady = true;
                }
            }));
            //��� ����ĸ������رյ�ʱ�� ��Ҫ���ٱ༭�� ����ڶ�����Ⱦ��ʱ�������� �ɸ��ݾ��岼�ֵ���
            var win = me.up('window');
            if (win && win.closeAction == "hide") {
                win.on('beforehide', function () {
                    me.onDestroy();
                });
            } else {
                var panel = me.up('panel');
                if (panel && panel.closeAction == "hide") {
                    panel.on('beforehide', function () {
                        me.onDestroy();
                    });
                }
            }
        } else {
            me.ke.html(me.getValue());
        }
    },
    setValue: function (value) {
        var me = this;
        if (!me.ke) {
            me.setRawValue(me.valueToRaw(value));
        } else {
            me.ke.html(value.toString());
        }
        me.callParent(arguments);
        return me.mixins.field.setValue.call(me, value);
    },
    getRawValue: function () {
        var me = this;
        if (me.KindEditorIsReady && me.ue) {
            me.ke.sync();
        }
        v = (me.inputEl ? me.inputEl.getValue() : Ext.value(me.rawValue, ''));
        me.rawValue = v;
        return v;
    },
    destroyKindEditor: function () {
        var me = this;
        if (me.rendered) {
            try {
                me.ke.remove();
                var dom = document.getElementById(me.id);
                if (dom) {
                    dom.parentNode.removeChild(dom);
                }
                me.ke = null;
            } catch (e) { }
        }
    },
    onDestroy: function () {
        var me = this;
        me.destroyKindEditor();
        me.callParent(arguments);
    }
});