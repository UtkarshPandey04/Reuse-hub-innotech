"use client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Filter, Star, ShoppingCart, Heart, Check, X, Trash2, Plus, MessageCircle, Edit, Trash } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ProductReviews } from "@/components/product-reviews"




export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [cartItems, setCartItems] = useState<any[]>([])
  const [addingToCart, setAddingToCart] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)
  const [newProduct, setNewProduct] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    quantity: '1',
    status: 'available',
    imageUrl: ''
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    category: '',
    price: '',
    quantity: '1',
    status: 'available',
    imageUrl: ''
  })
  const { toast } = useToast()

  const categories = ["All", "Fashion", "Home", "Tech", "Bedroom", "Lifestyle", "Office", "Electronics"]
  const types = ["All", "sale", "rent"]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        if (response.ok) {
          const data = await response.json()
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    const fetchUserProfile = async () => {
      try {
        const token = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth-token='))
        if (!token) return null

        const response = await fetch('/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token.split('=')[1]}`
          }
        })
        if (response.ok) {
          const userData = await response.json()
          setUser(userData)
          return userData._id
        }
      } catch (error) {
        console.error('Error fetching user profile:', error)
      }
      return null
    }

    const fetchCart = async (userId: string) => {
      if (userId) {
        try {
          const response = await fetch(`/api/cart?userId=${userId}`)
          if (response.ok) {
            const data = await response.json()
            setCartItems(data)
          }
        } catch (error) {
          console.error('Error fetching cart:', error)
        }
      }
    }

    const initializeData = async () => {
      await fetchProducts()
      const userId = await fetchUserProfile()
      if (userId) {
        await fetchCart(userId)
      }
    }

    initializeData()
  }, [])

  const filtered = products.filter((p) => {
    const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase())
    const matchCategory = selectedCategory === "All" || p.category === selectedCategory
    const matchType = selectedType === "All" || (p.status === selectedType || p.type === selectedType)
    return matchSearch && matchCategory && matchType
  })

  const isInCart = (productId: string) => {
    return cartItems.some(item => item.productId?._id === productId || item.productId === productId)
  }

  const handleAddToCart = async (product: any) => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to add items to cart",
        variant: "destructive"
      })
      return
    }

    setAddingToCart(product._id || product.id)
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          productId: product._id || product.id,
          quantity: 1
        })
      })

      if (response.ok) {
        const newCartItem = await response.json()
        setCartItems(prev => [...prev, newCartItem])
        toast({
          title: "Added to cart",
          description: `${product.title} has been added to your cart`
        })
        // Update header cart count
        if (typeof window !== 'undefined' && (window as any).updateCartCount) {
          const newCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0) + 1
          ;(window as any).updateCartCount(newCount)
        }
      } else {
        throw new Error('Failed to add to cart')
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive"
      })
    } finally {
      setAddingToCart(null)
    }
  }

  const handleRemoveFromCart = async (productId: string) => {
    if (!user) return

    try {
      const response = await fetch(`/api/cart?userId=${user._id}&productId=${productId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        const itemToRemove = cartItems.find(item => item.productId?._id === productId || item.productId === productId)
        setCartItems(prev => prev.filter(item => item.productId?._id !== productId && item.productId !== productId))
        toast({
          title: "Removed from cart",
          description: "Item has been removed from your cart"
        })
        // Update header cart count
        if (typeof window !== 'undefined' && (window as any).updateCartCount) {
          const newCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0) - (itemToRemove?.quantity || 0)
          ;(window as any).updateCartCount(newCount)
        }
      } else {
        throw new Error('Failed to remove from cart')
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
      toast({
        title: "Error",
        description: "Failed to remove item from cart",
        variant: "destructive"
      })
    }
  }

  const handleUpdateQuantity = async (productId: string, newQuantity: number) => {
    if (!user || newQuantity < 1) return

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          productId: productId,
          quantity: newQuantity - (cartItems.find(item => item.productId?._id === productId || item.productId === productId)?.quantity || 0)
        })
      })

      if (response.ok) {
        const updatedItem = await response.json()
        setCartItems(prev => prev.map(item =>
          (item.productId?._id === productId || item.productId === productId)
            ? { ...item, quantity: newQuantity }
            : item
        ))
        toast({
          title: "Quantity updated",
          description: "Cart quantity has been updated"
        })
        // Update header cart count
        if (typeof window !== 'undefined' && (window as any).updateCartCount) {
          const newCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0) + newQuantity - (cartItems.find(item => item.productId?._id === productId || item.productId === productId)?.quantity || 0)
          ;(window as any).updateCartCount(newCount)
        }
      } else {
        throw new Error('Failed to update quantity')
      }
    } catch (error) {
      console.error('Error updating quantity:', error)
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive"
      })
    }
  }

  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setNewProduct(prev => ({ ...prev, imageUrl: data.url }))
        toast({
          title: "Image uploaded",
          description: "Product image has been uploaded successfully"
        })
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Failed to upload image' }))
        const errorMessage = errorData.message || errorData.error || 'Failed to upload image'
        throw new Error(errorMessage)
      }
    } catch (error: any) {
      console.error('Error uploading image:', error)
      const errorMessage = error?.message || 'Failed to upload image'
      toast({
        title: "Upload failed",
        description: errorMessage,
        variant: "destructive"
      })
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddProduct = async () => {
    if (!user) {
      toast({
        title: "Please login first",
        description: "You need to be logged in to add products",
        variant: "destructive"
      })
      return
    }

    if (!newProduct.title || !newProduct.price || !newProduct.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const productData = {
        sellerId: user._id,
        title: newProduct.title,
        description: newProduct.description,
        category: newProduct.category,
        price: parseFloat(newProduct.price),
        imageUrl: newProduct.imageUrl,
        quantity: parseInt(newProduct.quantity),
        status: newProduct.status
      }

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        const createdProduct = await response.json()
        setProducts(prev => [createdProduct, ...prev])
        // Dialog removed, no longer needed
        setNewProduct({
          title: '',
          description: '',
          category: '',
          price: '',
          quantity: '1',
          status: 'available',
          imageUrl: ''
        })
        setImageFile(null)
        toast({
          title: "Product added",
          description: "Your product has been added to the marketplace"
        })
      } else {
        throw new Error('Failed to add product')
      }
    } catch (error) {
      console.error('Error adding product:', error)
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive"
      })
    }
  }

  const handleEditProduct = (product: any) => {
    setEditingProduct(product)
    setEditForm({
      title: product.title,
      description: product.description,
      category: product.category,
      price: product.price.toString(),
      quantity: product.quantity.toString(),
      status: product.status,
      imageUrl: product.imageUrl
    })
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct || !user) return

    if (!editForm.title || !editForm.price || !editForm.category) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields",
        variant: "destructive"
      })
      return
    }

    try {
      const productData = {
        title: editForm.title,
        description: editForm.description,
        category: editForm.category,
        price: parseFloat(editForm.price),
        imageUrl: editForm.imageUrl,
        quantity: parseInt(editForm.quantity),
        status: editForm.status
      }

      const response = await fetch(`/api/products/${editingProduct._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      })

      if (response.ok) {
        const updatedProduct = await response.json()
        setProducts(prev => prev.map(p => p._id === editingProduct._id ? updatedProduct : p))
        setEditingProduct(null)
        setEditForm({
          title: '',
          description: '',
          category: '',
          price: '',
          quantity: '1',
          status: 'available',
          imageUrl: ''
        })
        toast({
          title: "Product updated",
          description: "Your product has been updated successfully"
        })
      } else {
        throw new Error('Failed to update product')
      }
    } catch (error) {
      console.error('Error updating product:', error)
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive"
      })
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return

    console.log('Attempting to delete product with ID:', productId)

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE'
      })

      console.log('Delete response status:', response.status)

      if (response.ok) {
        setProducts(prev => prev.filter(p => p._id !== productId && p.id !== productId))
        toast({
          title: "Product deleted",
          description: "Your product has been removed from the marketplace"
        })
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        // If product not found, still remove from UI (might be stale data)
        if (response.status === 404) {
          setProducts(prev => prev.filter(p => p._id !== productId && p.id !== productId))
          toast({
            title: "Product deleted",
            description: "Product has been removed from the marketplace"
          })
        } else {
          console.error('Delete failed:', response.status, errorData)
          throw new Error(`Failed to delete product: ${errorData.error || response.statusText}`)
        }
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete product",
        variant: "destructive"
      })
    }
  }

  // Temporary function to clear all products (for testing)
  const handleClearAllProducts = async () => {
    if (!confirm('Are you sure you want to clear ALL products? This is for testing only.')) return

    try {
      const response = await fetch('/api/products/clear-all', {
        method: 'DELETE'
      })

      if (response.ok) {
        setProducts([])
        toast({
          title: "All products cleared",
          description: "Database has been cleared for testing"
        })
      } else {
        throw new Error('Failed to clear products')
      }
    } catch (error) {
      console.error('Error clearing products:', error)
      toast({
        title: "Error",
        description: "Failed to clear products",
        variant: "destructive"
      })
    }
  }

  return (
    <div className="min-h-screen">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Eco-Marketplace</h1>
          <p className="text-foreground/60 max-w-2xl">
            Browse quality secondhand and sustainable products. Every purchase saves money and the planet!
          </p>
        </div>

        <Tabs defaultValue="browse" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="browse">Browse Products</TabsTrigger>
            <TabsTrigger value="add">Add Product</TabsTrigger>
            <TabsTrigger value="edit" disabled={!editingProduct}>Edit Product</TabsTrigger>
            <TabsTrigger value="admin" className="text-red-500">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="browse" className="mt-8">

            {/* Search and Filter */}
            <div className="mb-8 space-y-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-background border-primary/20"
                  />
                </div>
                <Button variant="outline" className="border-primary/20 bg-transparent">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <div className="flex gap-2">
                  <span className="text-sm text-foreground/60 flex items-center">Type:</span>
                  {types.map((t) => (
                    <Button
                      key={t}
                      variant={selectedType === t ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedType(t)}
                      className={selectedType === t ? "bg-gradient-green-purple" : "border-primary/20"}
                    >
                      {t === "sale" ? "Buy" : t === "rent" ? "Rent" : "All"}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={selectedCategory === cat ? "bg-gradient-green-purple" : "border-primary/20"}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Products Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-foreground/60">Loading products...</p>
                </div>
              ) : filtered.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <p className="text-foreground/60">No products found matching your criteria.</p>
                </div>
              ) : (
                filtered.map((product) => (
                <Card
                  key={product._id || product.id}
                  className="overflow-hidden border-primary/20 hover:border-primary/40 transition-all-smooth group hover:shadow-xl"
                >
                  <div className="relative overflow-hidden h-56 bg-muted">
                    <img
                      src={product.imageUrl || product.image || "/placeholder.jpg"}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src !== '/placeholder.jpg') {
                          target.src = '/placeholder.jpg';
                        }
                      }}
                      loading="lazy"
                    />
                    <button
                      className="absolute top-2 right-2 p-2 rounded-lg bg-white/90 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Add to favorites"
                    >
                      <Heart className="w-5 h-5 text-primary" />
                    </button>
                    <div className="absolute top-2 left-2 px-2 py-1 bg-purple-500/90 rounded text-white text-xs font-semibold">
                      {(product.status === "available" || product.type === "sale") ? "BUY" : "RENT"}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-primary font-semibold mb-2">{product.category}</p>
                    <h3 className="font-semibold text-sm mb-2 line-clamp-2">{product.title}</h3>

                    <div className="flex items-center gap-1 mb-3">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{product.rating}</span>
                      <span className="text-xs text-foreground/60">({product.reviewsCount || product.reviews})</span>
                    </div>

                    <p className="text-xs text-foreground/60 mb-3">by {product.seller || (product.sellerId && (product.sellerId.username || product.sellerId.displayName)) || 'Unknown Seller'}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex flex-col">
                        <span className="text-lg font-bold text-primary">₹{product.priceINR || product.price}</span>
                        <span className="text-xs text-foreground/50">${product.priceUSD || product.price}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-3">
                      <Button
                        size="sm"
                        className="flex-1 bg-gradient-green-purple hover:opacity-90 h-8"
                        onClick={() => handleAddToCart(product)}
                        disabled={addingToCart === (product._id || product.id)}
                      >
                        {isInCart(product._id || product.id) ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            In Cart
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-4 h-4 mr-2" />
                            {(product.status === "available" || product.type === "sale") ? "Add to Cart" : "Rent Now"}
                          </>
                        )}
                      </Button>
                      {user && user._id === product.sellerId?._id && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => handleEditProduct(product)}
                            title="Edit product"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2 text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteProduct(product._id || product.id)}
                            title="Delete product"
                          >
                            <Trash className="w-4 h-4" />
                          </Button>
                        </>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" className="h-8 px-2">
                            <MessageCircle className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{product.title} - Reviews</DialogTitle>
                          </DialogHeader>
                          <ProductReviews productId={product._id || product.id} user={user} />
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="add" className="mt-8">
            {user ? (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
                  <p className="text-foreground/60">List your sustainable product for sale or rent in our marketplace.</p>
                </div>

                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        value={newProduct.title}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Product title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description">Description</Label>
                      <Textarea
                        id="description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Product description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="category">Category *</Label>
                        <Select value={newProduct.category} onValueChange={(value) => setNewProduct(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(cat => cat !== "All").map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="status">Type</Label>
                        <Select value={newProduct.status} onValueChange={(value) => setNewProduct(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Price (INR) *</Label>
                        <Input
                          id="price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="quantity">Quantity</Label>
                        <Input
                          id="quantity"
                          type="number"
                          value={newProduct.quantity}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, quantity: e.target.value }))}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="image">Product Image</Label>
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) {
                            setImageFile(file)
                            handleImageUpload(file)
                          }
                        }}
                        disabled={uploadingImage}
                      />
                      {uploadingImage && <p className="text-sm text-foreground/60 mt-1">Uploading...</p>}
                      {newProduct.imageUrl && (
                        <div className="mt-2">
                          <img src={newProduct.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleAddProduct} className="bg-gradient-green-purple hover:opacity-90">
                        Add Product
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setNewProduct({
                          title: '',
                          description: '',
                          category: '',
                          price: '',
                          quantity: '1',
                          status: 'available',
                          imageUrl: ''
                        })
                        setImageFile(null)
                      }}>
                        Clear
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">Please log in to add products to the marketplace.</p>
                <Button asChild className="bg-gradient-green-purple hover:opacity-90">
                  <Link href="/auth?mode=signin">Sign In</Link>
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="edit" className="mt-8">
            {editingProduct && user ? (
              <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Edit Product</h2>
                  <p className="text-foreground/60">Update your product details.</p>
                </div>

                <Card className="p-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="edit-title">Title *</Label>
                      <Input
                        id="edit-title"
                        value={editForm.title}
                        onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Product title"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-description">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={editForm.description}
                        onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                        placeholder="Product description"
                        rows={3}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-category">Category *</Label>
                        <Select value={editForm.category} onValueChange={(value) => setEditForm(prev => ({ ...prev, category: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.filter(cat => cat !== "All").map((cat) => (
                              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="edit-status">Type</Label>
                        <Select value={editForm.status} onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value }))}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="available">For Sale</SelectItem>
                            <SelectItem value="rent">For Rent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="edit-price">Price (INR) *</Label>
                        <Input
                          id="edit-price"
                          type="number"
                          value={editForm.price}
                          onChange={(e) => setEditForm(prev => ({ ...prev, price: e.target.value }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="edit-quantity">Quantity</Label>
                        <Input
                          id="edit-quantity"
                          type="number"
                          value={editForm.quantity}
                          onChange={(e) => setEditForm(prev => ({ ...prev, quantity: e.target.value }))}
                          placeholder="1"
                          min="1"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="edit-image">Product Image URL</Label>
                      <Input
                        id="edit-image"
                        value={editForm.imageUrl}
                        onChange={(e) => setEditForm(prev => ({ ...prev, imageUrl: e.target.value }))}
                        placeholder="Image URL"
                      />
                      {editForm.imageUrl && (
                        <div className="mt-2">
                          <img src={editForm.imageUrl} alt="Preview" className="w-20 h-20 object-cover rounded" />
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUpdateProduct} className="bg-gradient-green-purple hover:opacity-90">
                        Update Product
                      </Button>
                      <Button variant="outline" onClick={() => {
                        setEditingProduct(null)
                        setEditForm({
                          title: '',
                          description: '',
                          category: '',
                          price: '',
                          quantity: '1',
                          status: 'available',
                          imageUrl: ''
                        })
                      }}>
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-foreground/60 mb-4">No product selected for editing.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="admin" className="mt-8">
            <div className="max-w-2xl mx-auto">
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-red-500">Admin Panel</h2>
                <p className="text-foreground/60">Database management tools (for testing only)</p>
              </div>

              <Card className="p-6">
                <div className="space-y-4">
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h3 className="font-semibold text-red-800 mb-2">⚠️ Danger Zone</h3>
                    <p className="text-red-700 text-sm mb-4">
                      These actions will permanently delete data from the database. Use only for testing.
                    </p>
                    <Button
                      onClick={handleClearAllProducts}
                      variant="destructive"
                      className="w-full"
                    >
                      Clear All Products
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
