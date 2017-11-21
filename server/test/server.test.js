const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}]
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done())
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        let text = 'Test todo text';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect((res.body.text)).toBe(text);
            })
            .end((err, res) => {
                if(err){
                    return one(err);
                }
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', done => {
        request(app)
            .post('/todos')
            .send({})
            .expect(400)
            .end((err, res) => {
                if(err){
                    return done(err)
                }

                Todo.find().then(todos => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch(e => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo.text).toBe(todos[0].text)
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        let id = new ObjectID();
        request(app)
            .get(`/todos/${id}`)
            .expect(400)
            .end(done);
    });

    it('should return 404 for non-object id', done => {
        request(app)
            .get('/todos/123456')
            .expect(400)
            .end(done);
    });
});


describe('DELETE / todos/:id', () => {
    it('should remove a todo', done => {
        let id = todos[1]._id.toHexString();
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect(res => {
                expect(res.body.todo._id).toBe(id);
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }
                Todo.findById(id).then((todo) => {
                    expect(todo) === null;
                    done();
                }).catch(e => done(e));
            });
    });

    it('should return 404 if todo not found', done => {
        let id = new ObjectID();
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if ObjectID not found', done => {
        request(app)
            .delete('/todos/123456')
            .expect(404)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should update the todo', (done) => {
        let id = todos[0]._id.toHexString();
        let text = 'Updated new text';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: true,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt) === Number
            })
            .end(done);

    });

    it('should clear completedAt when todo is not completed', (done) => {
        let id = todos[1]._id.toHexString();
        let text = 'Updated new text !!!!';

        request(app)
            .patch(`/todos/${id}`)
            .send({
                completed: false,
                text
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt) === null;
            })
            .end(done);
    });
});
