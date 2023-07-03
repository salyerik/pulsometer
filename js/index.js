// Swiper-slider
new Swiper('.block3__slider', {
	navigation: { prevEl: '.block3__left', nextEl: '.block3__right' },
	autoplay: { delay: 1500 },
	spaceBetween: 50,
	slidesPerView: '1',
	loop: true,
});

// Anchors
const anchors = document.querySelectorAll('a[href*="#"]');
for (let anchor of anchors)
	anchor.addEventListener('click', e => {
		e.preventDefault();
		document
			.querySelector(anchor.getAttribute('href'))
			.scrollIntoView({ behavior: 'smooth', block: 'start' });
	});

// Tabs
const tabsBtn = document.querySelectorAll('.tabs__btn');
const tabsBlock = document.querySelectorAll('.tabs__block');
tabsBtn.forEach(tabBtn => {
	tabBtn.addEventListener('click', () => {
		const dataTab = document.querySelector(tabBtn.getAttribute('data-tab'));
		if (!tabBtn.classList.contains('active')) {
			tabsBtn.forEach(el => el.classList.remove('active'));
			tabsBlock.forEach(el => el.classList.remove('active'));
			tabBtn.classList.add('active');
			dataTab.classList.add('active');
		}
	});
});

// Animation
const animationElements = document.querySelectorAll('.animation');
if (animationElements.length > 0) {
	const animate = () => {
		for (let i = 0; i < animationElements.length; i++) {
			const element = animationElements[i];
			const offsetHeight = element.offsetHeight;
			const topSetHeight = element.getBoundingClientRect().top + window.scrollY;
			let totalHeight = window.innerHeight - offsetHeight / 4;
			if (offsetHeight > window.innerHeight) {
				totalHeight = window.innerHeight - window.innerHeight / 4;
			}
			if (
				scrollY > topSetHeight - totalHeight &&
				scrollY < topSetHeight + offsetHeight
			) {
				element.classList.add('active');
			}
		}
	};
	window.addEventListener('scroll', animate);
	setTimeout(animate, 300);
}

// Cart logic
const buyBtns = document.querySelectorAll('.tabs__buy'),
	cartBtn = document.querySelector('.cart__btn'),
	totalPrice = document.querySelector('.cart__total-price'),
	cartList = document.querySelector('.cart__list'),
	cartLogo = document.querySelector('.cart__logo'),
	quantity = document.querySelector('.cart__quantity'),
	cartInput = document.querySelector('.cart__input'),
	cartRow = document.querySelector('.cart__row'),
	cartName = document.querySelector('.cart__name'),
	cartPhone = document.querySelector('.cart__phone');
let count = 0;

const resetCart = () => {
	cartBtn.disabled = true;
	cartBtn.innerHTML = 'Cart is empty';
	totalPrice.innerHTML = '0 USD';
	cartName.value = '';
	cartPhone.value = '';
	count = 0;
	cartList.innerHTML = '';
	cartRow.style.display = 'none';
	cartList.style.display = 'none';
	cartInput.style.display = 'none';
	cartRow.style.margin = 0;
	quantity.innerHTML = 0;
};

resetCart();

buyBtns.forEach(buyBtn => {
	const product = buyBtn.closest('.tabs__product');
	product.setAttribute('data-id', Math.random().toString(16).substring(2, 8));

	buyBtn.addEventListener('click', () => {
		buyBtn.textContent = 'Added';
		const price = parseInt(product.querySelector('#price').innerText);
		const name = product.querySelector('.tabs__title').textContent;
		count += price;
		totalPrice.textContent = `${count} USD`;
		cartList.insertAdjacentHTML(
			'afterbegin',
			`<li>
				<article class="cart__product" data-id="${product.dataset.id}">
					<h3 class="cart__title tabs__title">${name}</h3>
					<div class="cart__price tabs__price tabs__price_w">${price}</div>
					<button class="cart__delete"></button>
				</article>
			</li>`,
		);
		quantity.textContent = cartList.children.length;
		buyBtn.disabled = true;
		cartBtn.disabled = false;
		cartBtn.textContent = 'Send the order';
		cartRow.style.display = 'flex';
		cartList.style.display = 'block';
		cartInput.style.display = 'flex';
		quantity.style.display = 'block';
	});
});

cartBtn.addEventListener('click', () => {
	if (cartName.value.trim() === '' || cartPhone.value.trim() === '') {
		cartName.classList.add('error');
		cartPhone.classList.add('error');
		alert('Fill in the fields');
	} else {
		cartName.classList.remove('error');
		cartPhone.classList.remove('error');
		cartBtn.innerHTML = 'Order is being sent...';
		buyBtns.forEach(buyBtn => {
			buyBtn.textContent = 'Buy';
			buyBtn.disabled = false;
		});
		setTimeout(() => {
			resetCart();
			alert('Order is sent');
		}, 1000);
	}
});

cartList.addEventListener('click', e => {
	if (!e.target.classList.contains('cart__delete')) return;

	const item = e.target.closest('li');
	const cartId = item.querySelector('.cart__product').dataset.id;

	const product = document
		.querySelector(`.tabs__product[data-id="${cartId}"]`)
		.querySelector('.tabs__buy');

	product.disabled = false;
	product.textContent = 'Buy';

	count -= parseInt(
		item.querySelector('.cart__price').textContent.replace(/\s/g, ''),
	);
	totalPrice.textContent = `${count} USD`;
	item.remove();
	quantity.textContent = cartList.children.length;
	if (cartList.children.length === 0) {
		resetCart();
	}
});

window.addEventListener('click', e => {
	if (e.target.closest('.cart__img')) cartLogo.classList.add('active');
	if (
		!e.target.closest('.cart__body') &&
		!e.target.closest('.cart__img') &&
		!e.target.classList.contains('cart__delete')
	) {
		cartLogo.classList.remove('active');
	}
});
