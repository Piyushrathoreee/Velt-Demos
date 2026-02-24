export const imgTablerIconBold = "/icons/bold.svg";
export const imgTablerIconItalic = "/icons/italic.svg";
export const imgTablerIconUnderline = "/icons/underline.svg";
export const imgTablerIconStrikethrough = "/icons/strikethrough.svg";

export const initialContent = `
<p><span data-heading="h1">Attention Is All You Need</span></p>
<p>Ashish Vaswani <br>
Google Brain avaswani@google.com <br>
Noam Shazeer <br>
Google Brain noam@google.com <br>
Niki Parmar <br>
Google Research nikip@google.com <br>
Jakob Uszkoreit <br>
Google Research usz@google.com <br>
Llion Jones <br>
Google Research llion@google.com <br>
Aidan N. Gomez <br>
University of Toronto aidan@cs.toronto.edu <br>
Łukasz Kaiser <br>
Google Brain lukaszkaiser@google.com <br>
Illia Polosukhin <br>
illia.polosukhin@gmail.com <br>
</p>

<p><span data-heading="h2">Abstract</span></p>
<p>The dominant sequence transduction models are based on complex recurrent or convolutional neural networks that include an encoder and a decoder. The best performing models also connect the encoder and decoder through an attention mechanism. We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely. Experiments on two machine translation tasks show these models to be superior in quality while being more parallelizable and requiring significantly less time to train.</p>

<p><span data-heading="h2">Introduction</span></p>
<p>Recurrent neural networks, long short-term memory and gated recurrent neural networks in particular, have been firmly established as state of the art approaches in sequence modeling and transduction problems such as language modeling and machine translation.</p>
<p>In this work we propose the Transformer, a model architecture eschewing recurrence and instead relying entirely on an attention mechanism to draw global dependencies between input and output.</p>

<p><span data-heading="h2">Background</span></p>
<p>The goal of reducing sequential computation also forms the foundation of the Extended Neural GPU, ByteNet and ConvS2S. Self-attention, sometimes called intra-attention is an attention mechanism relating different positions of a single sequence in order to compute a representation of the sequence.</p>

<p><span data-heading="h2">Model Architecture</span></p>
<p>Most competitive neural sequence transduction models have an encoder-decoder structure. The Transformer follows this overall architecture using stacked self-attention and point-wise, fully connected layers for both the encoder and decoder.</p>

<p><span data-heading="h2">Why Self-Attention</span></p>
<p>In this section we compare various aspects of self-attention layers to the recurrent and convolutional layers commonly used for mapping one variable-length sequence of symbol representations to another sequence of equal length.</p>

<p><span data-heading="h2">Training</span></p>
<p>This section describes the training regime for our models.</p>

<p><span data-heading="h2">Results</span></p>
<p>On the WMT 2014 English-to-German translation task, the big transformer model outperforms the best previously reported models by more than 2.0 BLEU, establishing a new state-of-the-art BLEU score of 28.4.</p>

<p><span data-heading="h2">Conclusion</span></p>
<p>In this work, we presented the Transformer, the first sequence transduction model based entirely on attention, replacing the recurrent layers most commonly used in encoder-decoder architectures with multi-headed self-attention.</p>

<p><span data-heading="h2">References</span></p>
<p><strong>[1]</strong> Jimmy Lei Ba, Jamie Ryan Kiros, and Geoffrey E Hinton. Layer normalization. arXiv preprint arXiv:1607.06450, 2016.</p>
<p><strong>[2]</strong> Dzmitry Bahdanau, Kyunghyun Cho, and Yoshua Bengio. Neural machine translation by jointly learning to align and translate. CoRR, abs/1409.0473, 2014.</p>
`;
