const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
        Post.findAll({
            attributes: [
                'id',
                'post_content',
                'title',
                'created_at',
                [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
            ],
            include: [
                {
                    model: Comment,
                    attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                    include: {
                        model: User,
                        attributes: ['username']
                    }
                },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbPostData => {
        //Single post to homepage template
        const posts = dbPostData.map(post => post.get({ plain: true }));
        res.render('homepage', {
            posts,
            loggedIn: req.session.loggedIn,
            username: dbPostData.username,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/post/:id', (req, res) => {
    Post.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'post_content',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
    .then(dbPostData => {
        if (!dbPostData) {
            res.status(404).json({ message: 'No post found with this id' });
            return;
        }
        // serialize the data
        const post = dbPostData.get({ plain: true });
        // pass data to template
        res.render('single-post', {
            post,
            loggedIn: req.session.loggedIn,
            username: dbPostData.username,
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json(err);
    });
});

router.get('/dashboard', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/login');
        return;
    }
    // finds one user
    User.findOne({
        where: {
            id: req.session.user_id
        },
        include: [
            {
                model: Post,
                attributes: ['id','post_content', 'title','created_at'],
            },
        ]
    })
    .then(dbPostData => {
        console.log("dbPostData", dbPostData.posts[0])
        if (!dbPostData) {
            res.status(404).json({ message: 'No blog posts found, use the button below to create one.' });
            return;
        }
        const posts = dbPostData.posts.map(post => post.get({ plain: true }));
        res.render('dashboard', {
            loggedIn: req.session.loggedIn,
            posts,
            username: dbPostData.username,
            user_id: req.session.user_id,
        });
    })
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('login', {
    });
});

router.get('/register', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('register', {
    });
});

router.get('/edit-post', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('edit-post', {
    });
});

router.get('/create-post', (req, res) => {
    if (!req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    res.render('create-post', {
    });
});

module.exports = router;