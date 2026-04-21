// AIC Aptitude Exam Question Bank
// Groups: 56=15Qs | 79=20Qs | 1012=30Qs | 1315=40Qs | 1617=40Qs
// Each question: { q, opts:[A,B,C,D], ans:'A'|'B'|'C'|'D', topic }

const QUESTION_BANK = {

  // ── Ages 5-6 (Tiny Explorers) — 15 questions ─────────────────────────────
  "56": [
    {q:"Which of these can talk to you and answer questions?",opts:["A chair","A smart speaker","A pencil","A window"],ans:"B",topic:"AI in Life"},
    {q:"What does a robot use to move?",opts:["Wings","Motors and wheels","Pencils","Water"],ans:"B",topic:"Robotics"},
    {q:"A computer is most like which part of a human?",opts:["A foot","A brain","A hand","An eye"],ans:"B",topic:"AI Basics"},
    {q:"What does a camera do?",opts:["Makes sounds","Takes pictures","Writes words","Cooks food"],ans:"B",topic:"Technology"},
    {q:"Which of these is a computer?",opts:["A football","A tablet","A sandwich","A flower"],ans:"B",topic:"Computers"},
    {q:"Which button makes letters appear on screen?",opts:["The mouse","The keyboard","The speaker","The charger"],ans:"B",topic:"Computers"},
    {q:"Traffic lights show Red, Yellow, Green in order. This is called a?",opts:["A game","A pattern","A song","A colour"],ans:"B",topic:"Patterns"},
    {q:"Red, Blue, Red, Blue, ___ — what comes next?",opts:["Green","Red","Yellow","Purple"],ans:"B",topic:"Patterns"},
    {q:"If you sort toys by colour, computers call this?",opts:["Driving","Sorting / classifying","Sleeping","Drawing"],ans:"B",topic:"Data"},
    {q:"A robot vacuum cleans by itself because it?",opts:["Likes cleaning","Follows instructions automatically","Watches TV","Plays games"],ans:"B",topic:"AI in Life"},
    {q:"What do '1' and '0' mean inside a computer?",opts:["Big and small","Yes and No / On and Off","Red and blue","Fast and slow"],ans:"B",topic:"Computers"},
    {q:"Which of these is an INPUT to a computer?",opts:["Screen showing a photo","Sound from a speaker","Pressing a keyboard key","A printed page"],ans:"C",topic:"Computers"},
    {q:"Step-by-step instructions for a computer are called?",opts:["A song","An algorithm","A drawing","A game"],ans:"B",topic:"Coding"},
    {q:"What does the internet help computers do?",opts:["Sleep faster","Talk to other computers around the world","Make food","Draw pictures"],ans:"B",topic:"Technology"},
    {q:"A self-driving car sees a red light. What should it do?",opts:["Speed up","Stop","Honk","Turn off"],ans:"B",topic:"AI in Life"}
  ],

  // ── Ages 7-9 (Little Explorers) — 20 questions ───────────────────────────
  "79": [
    {q:"What does a computer use to 'think'?",opts:["Its brain","A processor (CPU)","A keyboard","The screen"],ans:"B",topic:"AI Basics"},
    {q:"Which of these is a robot?",opts:["A pencil","A teddy bear","A vacuum cleaner robot","A book"],ans:"C",topic:"AI Basics"},
    {q:"What does a traffic light do?",opts:["Plays music","Tells cars when to go and stop","Takes photos","Talks to people"],ans:"B",topic:"AI in Life"},
    {q:"Which device can listen to your voice and answer questions?",opts:["A lamp","A smart speaker","A chair","A pencil case"],ans:"B",topic:"AI in Life"},
    {q:"What does 'data' mean?",opts:["A type of music","Information and facts","A game level","A robot's arm"],ans:"B",topic:"Data"},
    {q:"What do you call instructions given to a computer?",opts:["A story","A program or code","A drawing","A song"],ans:"B",topic:"Coding"},
    {q:"A camera that can recognize your face is using?",opts:["Sound recognition","Face recognition AI","Printing","Typing"],ans:"B",topic:"AI in Life"},
    {q:"What is an algorithm?",opts:["A type of dance","Step-by-step instructions","A musical note","A big robot"],ans:"B",topic:"Coding"},
    {q:"Which of these is NOT a computer input?",opts:["Keyboard","Mouse","Screen","Camera"],ans:"C",topic:"Computers"},
    {q:"What is the internet?",opts:["A big net for fish","A network that connects computers worldwide","A type of computer game","A robot"],ans:"B",topic:"Technology"},
    {q:"What does 'yes' or 'no' look like to a computer?",opts:["Words in a book","1 and 0 (binary)","Colors","Shapes"],ans:"B",topic:"Computers"},
    {q:"If a self-driving car sees a red light, what should it do?",opts:["Speed up","Stop","Honk","Turn off"],ans:"B",topic:"AI in Life"},
    {q:"What is Artificial Intelligence?",opts:["Machines that do smart tasks like humans","A type of video game","A brand of computer","A robot toy"],ans:"A",topic:"AI Basics"},
    {q:"Which of these is an example of Machine Learning?",opts:["A calculator adding numbers","An app learning your music taste","A clock showing time","A lamp turning on"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'input' mean in computing?",opts:["Data you put INTO a computer","Data that comes OUT","The screen display","The computer's memory"],ans:"A",topic:"Computers"},
    {q:"Binary code uses which two digits?",opts:["1 and 2","0 and 1","A and B","Yes and No"],ans:"B",topic:"Coding"},
    {q:"What is a loop in coding?",opts:["A circle shape","Repeating the same instructions many times","A type of error","A computer cable"],ans:"B",topic:"Coding"},
    {q:"Spam filters in email use AI to do what?",opts:["Send emails faster","Detect and block unwanted emails","Write emails for you","Delete all emails"],ans:"B",topic:"AI in Life"},
    {q:"What does 'debug' mean in programming?",opts:["Add new features","Find and fix errors in code","Delete a program","Write new code"],ans:"B",topic:"Coding"},
    {q:"Why is privacy important in AI systems?",opts:["It makes AI faster","It protects people's personal information","It improves AI accuracy","It reduces costs"],ans:"B",topic:"Ethics"}
  ],

  // ── Ages 10-12 (AI Builders) — 30 questions ──────────────────────────────
  "1012": [
    {q:"What is supervised learning in AI?",opts:["AI learning without guidance","AI learning from labeled examples","AI learning from rewards","AI learning by watching videos"],ans:"B",topic:"Machine Learning"},
    {q:"Which language is most commonly used for AI development?",opts:["Java","C++","Python","HTML"],ans:"C",topic:"Coding"},
    {q:"What is 'overfitting' in machine learning?",opts:["Training a model too slowly","A model that performs well on training data but poorly on new data","Using too much data","A type of data format"],ans:"B",topic:"Machine Learning"},
    {q:"What does NLP stand for?",opts:["Network Layer Protocol","Natural Language Processing","New Learning Platform","Numeric Logic Program"],ans:"B",topic:"AI Basics"},
    {q:"What does a neural network's 'hidden layers' do?",opts:["Store training data","Process and transform input data between input and output","Display results","Connect to the internet"],ans:"B",topic:"AI Basics"},
    {q:"What is 'big data'?",opts:["Data stored in big files","Extremely large datasets requiring special tools","Data from big companies only","Data about large objects"],ans:"B",topic:"Data"},
    {q:"In Python, what does print() do?",opts:["Sends to the printer","Displays output on screen","Creates a new variable","Stores data in memory"],ans:"B",topic:"Coding"},
    {q:"What is a decision tree in AI?",opts:["A tree diagram of programmer decisions","A model making decisions through a series of questions","A type of neural network","A program that grows like a tree"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'bias' in an AI model?",opts:["The speed of the AI","Systematic errors leading to unfair outcomes","The cost of the AI","The AI's accuracy rate"],ans:"B",topic:"Ethics"},
    {q:"What does API stand for?",opts:["Automated Program Interface","Application Programming Interface","Advanced Processing Intelligence","Artificial Program Integration"],ans:"B",topic:"Technology"},
    {q:"What does 'if-else' do in programming?",opts:["Loops through data","Executes different code blocks based on a condition","Defines a function","Stores a value"],ans:"B",topic:"Coding"},
    {q:"Which AI application helps doctors analyze medical images?",opts:["Autonomous vehicles","Medical image diagnosis AI","Language translation","Recommendation systems"],ans:"B",topic:"AI in Life"},
    {q:"What does 'cloud computing' mean?",opts:["Computing during cloudy weather","Using remote servers over the internet","A type of weather program","Storing data in the sky"],ans:"B",topic:"Technology"},
    {q:"What is recursion in programming?",opts:["A function calling another function","A function that calls itself","A loop that runs forever","A type of variable"],ans:"B",topic:"Coding"},
    {q:"What is 'transfer learning' in AI?",opts:["Moving data between computers","Using knowledge from one trained model for a different related problem","Training a model from scratch","Sharing AI models"],ans:"B",topic:"Machine Learning"},
    {q:"What is a convolutional neural network (CNN) best for?",opts:["Text analysis","Image recognition and processing","Sound generation","Number calculations"],ans:"B",topic:"AI Basics"},
    {q:"What is a recommendation system?",opts:["A system that recommends doctors","An AI system suggesting content based on user preferences","A system recommending programming languages","A system suggesting hardware"],ans:"B",topic:"AI in Life"},
    {q:"Which metric measures how often a classifier is correct overall?",opts:["Precision","Recall","Accuracy","F1-score"],ans:"C",topic:"Machine Learning"},
    {q:"What is 'data preprocessing'?",opts:["Creating new data","Cleaning and preparing raw data before training a model","Deleting unnecessary data","Storing data in a cloud"],ans:"B",topic:"Data"},
    {q:"What is the Internet of Things (IoT)?",opts:["The internet of games","Connecting everyday devices to the internet to collect and share data","A new internet browser","A social media platform"],ans:"B",topic:"Technology"},
    {q:"What is 'explainable AI'?",opts:["AI that talks simply","AI systems whose decisions can be understood by humans","AI that explains code","AI that writes explanations"],ans:"B",topic:"Ethics"},
    {q:"What does 'open source' mean in software?",opts:["Software that runs online only","Software whose code is freely available to view and modify","Software made by a large company","Software that costs nothing"],ans:"B",topic:"Technology"},
    {q:"What is an autonomous vehicle?",opts:["A vehicle controlled by remote","A self-driving vehicle using AI sensors and algorithms","A vehicle that runs on electricity","A very fast car"],ans:"B",topic:"AI in Life"},
    {q:"What is unsupervised learning?",opts:["Spam classification with labeled emails","Clustering similar behaviors without labels","Predicting house prices with past data","Recognizing faces with tagged photos"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'feature extraction' in machine learning?",opts:["Removing bugs","Selecting/transforming relevant attributes from raw data for model training","Extracting code","Storing features"],ans:"B",topic:"Machine Learning"},
    {q:"What is the difference between AI and robotics?",opts:["They are the same","AI is the intelligence/software; robotics is physical machines","Robotics is always smarter","AI only works on computers"],ans:"B",topic:"AI Basics"},
    {q:"What is a variable in coding?",opts:["A type of loop","A box that stores a value","A design element","A screen resolution"],ans:"B",topic:"Coding"},
    {q:"What does 'iteration' mean in programming?",opts:["Deleting old code","Repeating a process or code block multiple times","Writing new functions","Testing for errors"],ans:"B",topic:"Coding"},
    {q:"What is an example of AI ethics?",opts:["Making AI run faster","Ensuring AI is fair and does not discriminate","Teaching AI to play games","Designing computer chips"],ans:"B",topic:"Ethics"},
    {q:"What is a 'dataset'?",opts:["A collection of organized data","A single data file","A type of database","A programming language"],ans:"A",topic:"Data"}
  ],

  // ── Ages 13-15 (AI Innovators) — 40 questions ────────────────────────────
  "1315": [
    {q:"What is gradient descent in machine learning?",opts:["A technique to visualize data","An optimization algorithm that minimizes a loss function by adjusting model weights","A method to clean data","A type of neural network layer"],ans:"B",topic:"Machine Learning"},
    {q:"What is a loss function?",opts:["A function that deletes data","A function measuring the difference between predicted and actual values during training","A function that creates loops","A function that stores weights"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'epoch' mean in neural network training?",opts:["One data sample","One complete pass through the entire training dataset","One layer of the network","One neuron firing"],ans:"B",topic:"Machine Learning"},
    {q:"What is backpropagation?",opts:["Moving data backwards in storage","Calculating gradients and updating weights from output to input layers to minimize loss","A type of data preprocessing","Moving between web pages"],ans:"B",topic:"Machine Learning"},
    {q:"What is a GAN (Generative Adversarial Network)?",opts:["A network that classifies images","Two neural networks (generator and discriminator) competing to create realistic synthetic data","A network for natural language","A network that detects fraud"],ans:"B",topic:"AI Basics"},
    {q:"What is the vanishing gradient problem?",opts:["Gradients disappearing from storage","Gradients becoming too small during backprop in deep networks, preventing effective learning","A problem with too much data","A type of overfitting"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'regularization' do in machine learning?",opts:["Makes the model faster","Reduces overfitting by adding a penalty for model complexity","Increases training data","Speeds up gradient descent"],ans:"B",topic:"Machine Learning"},
    {q:"What is a transformer model?",opts:["A model that transforms images","An architecture using self-attention — foundation of GPT, BERT","A model that transforms code","A hardware component"],ans:"B",topic:"AI Basics"},
    {q:"What is 'attention mechanism' in transformers?",opts:["A way to focus on one data point","A mechanism allowing the model to weigh the importance of different parts of input","A memory optimization technique","A type of dropout"],ans:"B",topic:"AI Basics"},
    {q:"What does LSTM stand for?",opts:["Large Scale Training Model","Long Short-Term Memory","Linear Sequence Training Method","Layered Supervised Training Module"],ans:"B",topic:"AI Basics"},
    {q:"What is reinforcement learning?",opts:["Learning from labeled data","Learning through trial and error — an agent receives rewards or penalties for actions","Learning from watching examples","Learning from clustering"],ans:"B",topic:"Machine Learning"},
    {q:"What is the Turing Test?",opts:["A programming benchmark","A test where a machine must converse indistinguishably from a human","A test for hardware performance","An AI certification test"],ans:"B",topic:"AI History"},
    {q:"What is 'federated learning'?",opts:["Learning from one central dataset","Training models across decentralized devices while keeping data local for privacy","Learning from government data","A type of transfer learning"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'dropout' do in neural networks?",opts:["Removes training data","Randomly deactivates neurons during training to reduce overfitting","Drops the learning rate","Removes outliers from data"],ans:"B",topic:"Machine Learning"},
    {q:"What is a hyperparameter?",opts:["A very large parameter","A configuration value set before training (e.g. learning rate, batch size)","A parameter in the dataset","A parameter that auto-adjusts"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'precision' measure?",opts:["Overall model accuracy","Out of all positive predictions, what fraction were actually positive","Out of all actual positives, what fraction were identified","The speed of the model"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'recall' (sensitivity)?",opts:["The model's memory","Out of all actual positive cases, what fraction did the model correctly identify","Out of all predicted positives, how many are correct","The number of training epochs"],ans:"B",topic:"Machine Learning"},
    {q:"What is the F1-score?",opts:["A grade for AI systems","The harmonic mean of precision and recall","The first evaluation metric","A type of loss function"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'data augmentation'?",opts:["Deleting duplicate data","Artificially increasing training data by applying transformations to existing samples","Collecting more external data","Normalizing data values"],ans:"B",topic:"Data"},
    {q:"What is a 'confusion matrix'?",opts:["A matrix showing model confusion","A table showing TP, FP, FN, TN used to evaluate classification performance","A type of neural network","A matrix of training data"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'semantic segmentation'?",opts:["Dividing text into sentences","Classifying every pixel in an image into a category","Detecting objects with bounding boxes","Identifying image colors"],ans:"B",topic:"AI Basics"},
    {q:"What does GPT stand for?",opts:["General Purpose Technology","Generative Pre-trained Transformer","Graph Processing Tool","Guided Pattern Training"],ans:"B",topic:"AI Basics"},
    {q:"What is 'zero-shot learning'?",opts:["Training a model with zero data","A model's ability to recognize classes it was never explicitly trained on","Training that takes no time","Learning with zero errors"],ans:"B",topic:"Machine Learning"},
    {q:"What is the purpose of a validation set?",opts:["To train the model","To tune hyperparameters and evaluate model during training without contaminating the test set","To test the final model","To store backup data"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'batch normalization'?",opts:["Grouping data into batches","Normalizing layer inputs during training to stabilize and speed up neural network training","Reducing batch size","A type of activation function"],ans:"B",topic:"Machine Learning"},
    {q:"What is an activation function?",opts:["A function that activates the network","A function applied to a neuron's output to introduce non-linearity (e.g. ReLU, sigmoid)","A function that starts training","A function that sets hyperparameters"],ans:"B",topic:"AI Basics"},
    {q:"What is 'ReLU' in neural networks?",opts:["Real-time Learning Unit","Rectified Linear Unit — outputs 0 for negative values, the value itself for positive","Recurrent Learning Update","Regular Loss Unit"],ans:"B",topic:"AI Basics"},
    {q:"What is 'k-fold cross-validation'?",opts:["Folding data into k groups","Dividing data into k subsets; training k times each with a different validation subset","A technique to reduce k parameters","A validation for k-nearest neighbors only"],ans:"B",topic:"Machine Learning"},
    {q:"What is PCA (Principal Component Analysis)?",opts:["A method to add features","A dimensionality reduction technique retaining variance in fewer dimensions","A classification algorithm","A type of neural network"],ans:"B",topic:"Data"},
    {q:"What is the 'bias-variance tradeoff'?",opts:["Trading accuracy for speed","Balancing underfitting (high bias) and overfitting (high variance) to achieve good generalization","A tradeoff between precision and recall","A tradeoff between data and compute"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'word embedding' in NLP?",opts:["Hiding words in text","Representing words as dense numerical vectors capturing semantic meaning (e.g. Word2Vec, GloVe)","Encrypting text data","Splitting text into tokens"],ans:"B",topic:"AI Basics"},
    {q:"What is 'computer vision'?",opts:["Programming in a visual language","AI field enabling computers to understand and process visual information from images and videos","Designing computer graphics","A type of screen display"],ans:"B",topic:"AI Basics"},
    {q:"What is 'algorithmic fairness'?",opts:["Ensuring algorithms run fast","Ensuring AI makes decisions without discriminating against groups based on sensitive attributes","Writing clean code","Making algorithms open source"],ans:"B",topic:"Ethics"},
    {q:"What is 'deepfake' technology?",opts:["Very deep neural networks","AI-generated synthetic media that realistically depicts someone doing or saying something they didn't","A deep learning debugging tool","Deep data storage"],ans:"B",topic:"Ethics"},
    {q:"What is 'multi-modal AI'?",opts:["AI with multiple models","AI that can process multiple types of data (text, images, audio) together","AI running on multiple computers","AI with multiple users"],ans:"B",topic:"AI Basics"},
    {q:"What is 'AI safety'?",opts:["Making sure AI robots don't fall","Research ensuring AI systems behave as intended and don't cause unintended harm","Securing AI servers from hackers","Training AI on safe data"],ans:"B",topic:"Ethics"},
    {q:"What is 'model interpretability'?",opts:["How fast a model runs","The degree to which humans can understand why a model made a specific prediction","How well a model is coded","The model's documentation quality"],ans:"B",topic:"Ethics"},
    {q:"What is 'prompt engineering'?",opts:["Engineering computer prompts","Designing effective input prompts to guide large language models toward desired outputs","Programming a new AI model","A type of data preprocessing"],ans:"B",topic:"AI Basics"},
    {q:"What is 'natural language generation' (NLG)?",opts:["Generating programming languages","AI capability to automatically produce human-readable text from structured data","Translating natural language","Detecting language type"],ans:"B",topic:"AI Basics"},
    {q:"What is 'model interpretability'?",opts:["How fast a model runs","The degree to which humans can understand why a model made a specific prediction","How well a model is coded","Documentation quality"],ans:"B",topic:"Ethics"}
  ],

  // ── Ages 16-17 (AI Pioneers) — 40 questions ──────────────────────────────
  "1617": [
    {q:"What is the difference between supervised, unsupervised, and reinforcement learning?",opts:["They use different hardware","They differ in how the model receives feedback: labeled data, unlabeled data, or reward signals respectively","They differ only in speed","They are used for different file types"],ans:"B",topic:"Machine Learning"},
    {q:"What is a Markov Decision Process (MDP)?",opts:["A type of encryption","A mathematical framework for modeling decision-making in environments with states, actions, and rewards","A database query language","A type of regression"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'stochastic gradient descent' (SGD) mean?",opts:["Gradient descent using all data at once","Gradient descent using one or a mini-batch of random samples per update step","A type of neural network","A gradient that changes direction randomly"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'model distillation'?",opts:["Cleaning training data","Training a smaller student model to mimic a larger, more complex teacher model","Compressing image files","A type of data augmentation"],ans:"B",topic:"Machine Learning"},
    {q:"What are 'embeddings' in deep learning?",opts:["Hiding data in files","Dense vector representations of discrete objects (words, images) in a continuous space","A type of activation function","A compression algorithm"],ans:"B",topic:"AI Basics"},
    {q:"What is 'contrastive learning'?",opts:["Learning by comparing answers","A self-supervised method training a model to bring similar samples closer and push dissimilar ones apart in embedding space","Learning using labels only","A type of reinforcement learning"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'autoencoder' do?",opts:["Automatically writes code","Learns compressed representations of data by encoding to a bottleneck and reconstructing the output","Translates languages automatically","Generates images from text"],ans:"B",topic:"AI Basics"},
    {q:"What is a 'variational autoencoder' (VAE)?",opts:["A standard autoencoder with a larger bottleneck","A generative model learning a probabilistic latent space for generating new samples","A type of GAN","A supervised classification model"],ans:"B",topic:"AI Basics"},
    {q:"What is 'hyperparameter tuning'?",opts:["Adjusting model weights during training","Searching for the best hyperparameter values (e.g. via grid search, random search, Bayesian optimization)","Removing unnecessary layers from a network","Setting the random seed"],ans:"B",topic:"Machine Learning"},
    {q:"What does 'sparse representation' mean in machine learning?",opts:["Having very little data","Representing data in a high-dimensional space where most values are zero","Using fewer neurons","A type of compression only"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'causal inference' in AI?",opts:["Inferring correlations in data","Determining cause-and-effect relationships rather than just statistical correlations","A type of classification","Building decision trees"],ans:"B",topic:"AI Basics"},
    {q:"What is 'few-shot learning'?",opts:["Training with few GPUs","Training a model to generalize from very few labeled examples per class","A type of transfer learning requiring no data","Learning with few epochs"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'neural architecture search' (NAS)?",opts:["Manually designing neural networks","Automatically searching for optimal neural network architectures using algorithms","A method for pruning networks","A type of data search"],ans:"B",topic:"AI Basics"},
    {q:"What is the 'curse of dimensionality'?",opts:["Too many computer dimensions","The phenomenon where high-dimensional spaces make data sparse, making algorithms perform poorly","A type of overfitting","A problem with very large models"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'graph neural network' (GNN)?",opts:["A neural network that draws graphs","A type of neural network designed to operate on graph-structured data (nodes and edges)","A visualization tool for neural networks","A network that processes geometric shapes"],ans:"B",topic:"AI Basics"},
    {q:"What is 'attention is all you need' referring to?",opts:["A focus technique for programmers","The 2017 paper introducing the transformer architecture based entirely on self-attention mechanisms","A reinforcement learning paper","A method for improving human attention"],ans:"B",topic:"AI History"},
    {q:"What does RLHF stand for?",opts:["Recursive Learning with High Frequency","Reinforcement Learning from Human Feedback — used to align LLMs with human preferences","Randomized Learning for High-Fidelity models","Real-time Learning for Humanoid Feedback"],ans:"B",topic:"AI Basics"},
    {q:"What is 'model pruning'?",opts:["Removing bad data","Removing redundant or low-importance weights/neurons from a trained model to reduce size and speed up inference","Cutting the number of training epochs","Reducing the learning rate"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'quantization' in AI model deployment?",opts:["Measuring model quality","Reducing the precision of model weights (e.g. 32-bit to 8-bit) to decrease size and increase inference speed","Adding more training data","A type of data normalization"],ans:"B",topic:"Machine Learning"},
    {q:"What is a 'foundation model'?",opts:["A model with a strong mathematical foundation","A large model trained on broad data at scale, adaptable to many tasks (e.g. GPT-4, BERT, CLIP)","A model used for foundational research only","A small baseline model"],ans:"B",topic:"AI Basics"},
    {q:"What is 'chain-of-thought' prompting?",opts:["Linking multiple prompts together","A prompting technique encouraging LLMs to reason step-by-step before giving a final answer","A way to chain API calls","A type of few-shot learning only"],ans:"B",topic:"AI Basics"},
    {q:"What is 'hallucination' in large language models?",opts:["When the model crashes","When the model generates confident but factually incorrect or made-up information","When the model repeats itself","When the model refuses to answer"],ans:"B",topic:"Ethics"},
    {q:"What is 'responsible AI'?",opts:["AI that responds quickly","Developing and deploying AI in ways that are ethical, transparent, fair, accountable, and safe","AI that is open source","AI that works without errors"],ans:"B",topic:"Ethics"},
    {q:"What is 'differential privacy'?",opts:["Privacy between two different databases","A mathematical technique ensuring individual data points cannot be inferred from model outputs or aggregate statistics","A type of data encryption","A privacy policy for companies"],ans:"B",topic:"Ethics"},
    {q:"What is 'multi-task learning'?",opts:["Learning multiple programming languages","Training a model to perform multiple related tasks simultaneously, sharing representations","Running multiple models at once","Training with multiple datasets sequentially"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'continual learning' (lifelong learning)?",opts:["Training a model for a very long time","Training a model to learn new tasks sequentially without forgetting previously learned knowledge","A type of reinforcement learning","Training continuously without stopping"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'model alignment'?",opts:["Aligning model weights mathematically","Ensuring AI systems pursue goals and behave in ways that are aligned with human values and intentions","Aligning multiple models together","A method for model calibration"],ans:"B",topic:"Ethics"},
    {q:"What is 'Retrieval-Augmented Generation' (RAG)?",opts:["A method of generating random data","Combining a retrieval system with a generative model so it can reference external knowledge when generating responses","A type of GAN","A method of training on retrieved internet data"],ans:"B",topic:"AI Basics"},
    {q:"What is 'emergent behavior' in large AI models?",opts:["Bugs appearing in large models","Capabilities that arise in large models that were not explicitly trained for and not present in smaller models","A type of overfitting unique to large models","Random outputs from untrained models"],ans:"B",topic:"AI Basics"},
    {q:"What is 'Mixture of Experts' (MoE)?",opts:["A committee of human experts advising an AI","A model architecture where only a subset of the network (experts) is activated for each input, improving efficiency","A type of ensemble method using different model types","An AI judging system"],ans:"B",topic:"AI Basics"},
    {q:"What is the AI Act (EU)?",opts:["A law making AI mandatory in Europe","A comprehensive EU regulation classifying AI systems by risk level and imposing requirements accordingly","A technical standard for AI hardware","A tax on AI companies in Europe"],ans:"B",topic:"Ethics"},
    {q:"What is 'synthetic data' in AI?",opts:["Data about synthetic materials","Artificially generated data that mimics real data, used to train models when real data is scarce or private","Data from simulation games only","Data generated by GANs only"],ans:"B",topic:"Data"},
    {q:"What is 'model calibration'?",opts:["Setting up a model for first use","Ensuring a model's predicted probabilities accurately reflect the true likelihood of outcomes","Adjusting the learning rate","Evaluating model accuracy"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'edge AI'?",opts:["AI developed in Silicon Valley","Running AI inference directly on local devices (phones, sensors) rather than in the cloud, reducing latency and improving privacy","AI for detecting image edges","A lightweight version of GPT"],ans:"B",topic:"Technology"},
    {q:"What is 'explainability' vs 'interpretability' in AI?",opts:["They are the same thing","Interpretability is understanding the model's internal mechanisms; explainability is providing human-understandable reasons for specific decisions","Explainability is about model accuracy; interpretability is about speed","Interpretability is for regulators; explainability is for users"],ans:"B",topic:"Ethics"},
    {q:"What is 'online learning' in machine learning?",opts:["Learning using online resources","A training approach where the model updates its parameters incrementally as new data arrives, rather than batch retraining","Learning that happens on the internet","A type of self-supervised learning"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'domain adaptation'?",opts:["Adapting a website domain","Adapting a model trained on one domain (source) to perform well on a different but related domain (target)","Changing the model's architecture","A type of fine-tuning for language models"],ans:"B",topic:"Machine Learning"},
    {q:"What is 'semantic search'?",opts:["Searching for synonyms","Searching that understands the meaning and context of a query rather than just matching keywords","A type of database indexing","Searching within semantic segmentation models"],ans:"B",topic:"AI Basics"},
    {q:"What is 'AI governance'?",opts:["The technical management of AI systems","The frameworks, policies, and oversight mechanisms that guide the responsible development, deployment, and accountability of AI","A type of AI safety training","Managing AI computing resources"],ans:"B",topic:"Ethics"},
    {q:"What is 'inference' in machine learning?",opts:["Drawing logical conclusions about data quality","Using a trained model to make predictions on new, unseen data","The process of training a neural network","Evaluating model performance on a test set"],ans:"B",topic:"Machine Learning"}
  ]
};

// Question count per age group
const Q_COUNT = { "56": 15, "79": 20, "1012": 30, "1315": 40, "1617": 40 };

function getQuestions(ageGroup) {
  const bank = QUESTION_BANK[ageGroup] || [];
  const count = Q_COUNT[ageGroup] || 20;
  // Shuffle and return required count
  const shuffled = [...bank].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
