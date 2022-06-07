import { Button, Form, FormItem, Input, InputPassword, PageHeader, Row, Col, Card, Table, Avatar } from "ant-design-vue";
export  default ({
    install : (app, options)=> {
        app
            .use(Button)
            .use(Form)
            .use(FormItem)
            .use(Input)
            .use(InputPassword)
            .use(PageHeader)
            .use(Row)
            .use(Col)
            .use(Card)
            .use(Table)
            .use(Avatar)
    }
})