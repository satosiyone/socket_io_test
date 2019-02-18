# socket_io_test

# 設計
- Nodeサーバにアクセス
    - .js
        - app.get で index.htmlに転送
    - .html
        - socket.io.jsが読み込まれる
        - ログインフォームが表示
- ログインボタン押下
    - .html
        - チャットフォームが表示
        - `ユーザ情報` 送信
            - emit `login`
                - userID: socket.id // クライアントが発行した `io()` でidが取得できる
                - userName: userName
    - .js
        - on `connection`
            - `ユーザ情報` 受け取る
                - on `login`
                    - loginUsers[ID]に名前を保存
- チャット送信時
    - .html
        - メッセージを送信
            - emit `chat message`
    - .js
        - メッセージを受け取る
            - on `chat message`
                - `socket` に紐付く `ID` でユーザ名を特定
                - `ユーザ情報` を送信
                    - emit `chat message`
    - .html
        - ユーザ情報とメッセージを受け取る
            - on `chat message`
                - ユーザ情報とメッセージを表示

# フロー



