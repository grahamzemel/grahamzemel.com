<script context="module">
	export const prerender = true;
</script>

<script>
  import '../../../app.css'
  import '../../../prism.css'
  import 'focus-visible'
  import { onMount } from 'svelte'
  onMount(async function () {
    const handleMessageCount = () => {
      var msg = document.getElementById('message').value
      var msgCount = document.getElementById('message-count')
      var msgLength = msg.length
      const maxLength = 1000
      var charLeft = maxLength - msgLength
      msgCount.innerText = charLeft
    }
    message.addEventListener('input', handleMessageCount)
    fetch('https://api.rss2json.com/v1/api.json?rss_url=https://medium.com/feed/the-gray-area')
      .then((res) => res.json())

      .then((data) => {
        // Filter for acctual posts. Comments don't have categories, therefore can filter for items with categories bigger than 0
        const res = data.items //This is an array with the content. No feed, no info about author etc..
        const posts = res.filter((item) => item.categories.length > 0).slice(0, 3) // That's the main trick* !
        // Functions to create a short text out of whole blog's content
        function toText(node) {
          let tag = document.createElement('div')
          tag.innerHTML = node
          node = tag.innerText
          return node
        }
        function shortenText(text, startingPoint, maxLength) {
          return text.length > maxLength ? text.slice(startingPoint, maxLength) : text
        }

        // Put things in right spots of markup
        let output = ''
        posts.forEach((item) => {
          output += `
         <li class="blog__post">
            <a href="${item.link}">
               <img src="${item.thumbnail}" class="blog__topImg"></img>
               <div class="blog__content">
                  <div class="blog_preview">
                     <h2 class="blog__title">${shortenText(item.title, 0, 60)}</h2>
                     <p class="blog__intro">${shortenText(toText(item.content), 0, 150) + '...'}</p>
                  </div>
                  <div class="blog__info">
                     <span class="blog__author">${item.author}</span>
                     <span class="blog__date">${shortenText(item.pubDate, 0, 10)}</span>
                  </div>
                  <hr>
               </div>
            <a/>
         </li>`
        })
        document.querySelector('.blog__slider').innerHTML = output
      })
  })
  const handleSubmit = (e) => {
		e.preventDefault()
		let myForm = document.getElementById('myform');
		let formData = new FormData(myForm);
		fetch('/', {
			method: 'POST',
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams(formData).toString()
		}).then(() => console.log('Form successfully submitted')).catch((error) =>
			alert(error))
	}
</script>

<svelte:head>
  <title>Graham Zemel | Contact Me</title>
</svelte:head>
<div style="position: absolute;justify-content:right;text-align: right;top:0%;left:79.5%;">
  <section id="blog" class="blog">
    <div class="blog__header">
      <p class="blog__header1 text-[#4b5563] dark:text-white">New From</p>
      <div>
        <a href="https://medium.com/the-gray-area/">
          <img
            src="/grayArea.jpg"
            alt="The Gray Area Medium"
            style="height:75px;width:75px;border-style:solid; border-color: #5a5a5a;padding:5px;border-width: 1px;"
          />
        </a>
      </div>
      <p class="blog__header2 text-[#4b5563] dark:text-white">The Gray Area</p>
    </div>
    <ul class="blog__slider">Javascript Required</ul>
  </section>
</div>

<div class="flex flex-col flex-grow">
  <section id="contact">
    <div class="container">
      <div class="title-container scroll-in">
        <h2 class="section-title">Contact <span class="title-icon">&#128231;</span></h2>
        <p class="section-subtitle">
          Talk with me about job opportunities, request my résumé, discuss hacking, or just say hi
          :)
        </p>
      </div>
      <div class="contact-content">
        <div class="form-container scroll-in">
          <noscript
            >This form won't work without JavaScript but you can send me a message on <a
              href="https://twitter.com/grahamzemel"
              style="text-decoration: underline;">Twitter</a
            >.</noscript
          >
          <p class="success-message"/>
          <form name="contact" on:submit{handleSubmit} method="POST" netlify netlify-honeypot="bot-field">
            <input type="hidden" name="form-name" value="contact"/>
            <div class="input-container">
              <input type="text" id="name" name="name" required class="form-input" />
              <label for="name">Name:</label>
            </div>
            <div class="input-container">
              <input type="email" id="email" name="email" required class="form-input" />
              <label for="email">Email:</label>
            </div>
            <div class="input-container">
              <input type="text" id="subject" name="subject" class="form-input" />
              <label for="subject">Subject (optional):</label>
            </div>
            <div class="input-container">
              <textarea required maxlength="1000" id="message" name="message" class="form-input" />
              <label for="message">Message:<br /> </label>
              <small>
                <span id="message-count">1000</span> characters
              </small>
            </div>
            <div>
              <button
                class="bg-opacity-50 dark:bg-opacity-50 text-gray-800 bg-[#d1d5da] dark:bg-[#374151] dark:text-gray-200 text-opacity-50"
                type="submit"
                id="submitButton">Submit</button
              >
            </div>
          </form>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  .form-container {
    flex: 1 0 auto;
    max-width: 600px;
    width: 100%;
    margin-right: 3rem;
  }

  .input-container {
    position: relative;
    margin: 1.5rem 0;
  }

  .input-container .form-input {
    width: 100%;
    box-sizing: border-box;
    background: transparent;
    border: 1px solid gray;
    /* color: var(--text-color); */
    transition: border 500ms;
    padding: 1.5rem 1rem 0.5rem;
    margin-top: 1rem;
    font-size: 1.15rem;
  }

  .input-container textarea {
    height: 300px;
    resize: none;
    font: inherit;
  }

  .input-container label {
    display: block;
    position: absolute;
    width: 100%;
    font-size: 1.15rem;
    top: 15px;
    padding: 0.25rem 1rem;
    color: gray;
    transform-origin: left;
    user-select: none;
    transition: all 500ms;
  }

  .input-container .form-input:hover,
  .input-container .form-input:focus {
    outline: none;
    border-color: gray;
  }

  .form-input:focus + label {
    top: 1rem;
    font-size: 0.75rem;
    /* background-color: var(--shade-500); */
    /* color: var(--background-color); */
    user-select: auto;
  }
  .contact-content {
    display: flex;
    flex-wrap: wrap;
  }
  #submitButton {
    display: flex;
    justify-items: center;
    padding-left: 1rem;
    padding-right: 1rem;
    border: solid gray 2px;
  }
</style>
